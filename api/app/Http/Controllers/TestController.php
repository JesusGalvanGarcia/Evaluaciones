<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Test;
use App\Models\TestModule;
use App\Models\UserEvaluation;
use App\Models\UserTest;
use App\Services\QuestionService;
use App\Services\TestModuleService;
use App\Services\TestService;
use App\Services\UserEvaluationService;
use App\Services\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class TestController extends Controller
{

    private $prefix = 'Test';

    public function index()
    {
        //
    }

    public function indexPLD(string $id_test)
    {
        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P001'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X201'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);

                $assigned_users = UserEvaluation::select(
                    'user_id'
                )
                ->whereIn( 'id', 
                [DB::raw("(SELECT user_evaluation_id FROM user_tests WHERE test_id = $id_test)")]                    )
                ->get()
                ->pluck('user_id')
                ->unique();
                $test = Test::select(
                    'id',
                    'name',
                    'introduction_text',
                    'min_score',
                    'max_attempts',
                    'evaluation_id',
                    'start_date',
                    'end_date',
                )
                ->with([
                    'test_modules' => function ($query) use ($id_test) {
                        $query->select(
                            'id', 
                            'test_id'
                        );
                
                        $query->with([
                            'questions' => function ($query) use ($id_test) {
                                $query->select(
                                    'id', 
                                    'description', 
                                    'score', 
                                    'module_id'
                                );
                                $query->with([
                                    'answers' => function ($query) use ($id_test) {
                                        $query->select(
                                            'id',
                                            'description',
                                            'score',
                                            'question_id',
                                        )
                                        ->orderBy('score', 'desc');
                                    }
                                ]);
                            }
                        ]);
                    },
                ])
                ->find($id_test);
            if (!$test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X203'
                ], 400);
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba consultado correctamente',
                'test' => $test,
                'assigned_users' => $assigned_users
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function storePLD(Request $request)
    {
        try{
            $validator = Validator::make($request->test, [
                'name' => 'required|string',
                'introduction_text' => 'required|string',
                'min_score' => 'required|integer|min:0',
                'max_attempts' => 'required|integer|not_in:0|min:0',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'test_modules.*.questions.*.description' => 'required|string',
                'test_modules.*.questions.*.answers.*.description' => 'required|string',
            ]);
        if ($validator->fails()) {
            return response()->json([
                'title' => 'Datos Faltantes',
                'message' => $validator->messages(),
                'code' => $this->prefix . 'X501'
            ], 400);
        }
        $user = UserService::checkUser(request('user_id'));

        if (!$user)
            return response()->json([
                'title' => 'Consulta Cancelada',
                'message' => 'Usuario invalido, no tienes acceso.',
                'code' => $this->prefix . 'X502'
            ], 400);

        DB::beginTransaction();
        $test = TestService::createPldTest($request->test, $request->user_id, $request->assigned_users);
        
        if(!$test){
            DB::rollBack();
            return response()->json([
                'title' => 'Examen Cancelado',
                'message' => 'Error al crear la Prueba',
                'code' => $this->prefix . 'X502'
            ], 400);
            
        }

        DB::commit();

        return response()->json([
            'title' => 'Proceso terminado',
            'message' => 'Prueba creada exitosamente',
            'test' => $test
        ]);
        
    } catch (Exception $e) {

        DB::rollBack();
        return response()->json([
            'title' => 'Ocurrio un error en el servidor',
            'message' => $e->getMessage() . ' -L:' . $e->getLine(),
            'code' => $this->prefix . 'X699'
        ], 500);
    }
    }

    public function show(string $id)
    {
        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P001'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X201'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);

            $test = UserTest::find($id);

            if (!$test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X203'
                ], 400);
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba consultado correctamente',
                'test' => $test
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }

    public function showPLD()
    {
        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P001'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X201'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);

            $tests = Test::select(
                'tests.id',
                'tests.name',
                'tests.end_date',
                DB::raw('COALESCE(COUNT(user_tests.id), 0) as amount_answers')
            )
            ->leftJoin('user_tests', function($join) {
                $join->on('tests.id', '=', 'user_tests.test_id')
                    ->whereNotNull('user_tests.finish_date');
            })
            ->where('tests.evaluation_id', '=', 2)
            ->whereNull('user_tests.deleted_at')
            ->groupBy('tests.id', 'tests.name', 'tests.end_date')
            ->get();

            if (!$tests)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X203'
                ], 400);
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba consultado correctamente',
                'tests' => $tests
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }

    public function updatePLD(Request $request, string $id_test)
    {
        try{
            $validator = Validator::make($request->test, [
                'name' => 'required|string',
                'introduction_text' => 'required|string',
                'min_score' => 'required|integer|min:0',
                'max_attempts' => 'required|integer|not_in:0|min:0',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'test_modules.*.questions.*.description' => 'required|string',
                'test_modules.*.questions.*.answers.*.description' => 'required|string',
                'test_modules.*.questions.*.answers.*.score' => 'required|integer',
            ]);
        if ($validator->fails()) {
            return response()->json([
                'title' => 'Datos Faltantes',
                'message' => $validator->messages(),
                'code' => $this->prefix . 'X501'
            ], 400);
        }
        $user = UserService::checkUser(request('user_id'));

        if (!$user)
            return response()->json([
                'title' => 'Consulta Cancelada',
                'message' => 'Usuario invalido, no tienes acceso.',
                'code' => $this->prefix . 'X502'
            ], 400);

        DB::beginTransaction();

        $test = TestService::updatePldTest(
                $request->test, 
                $request->user_id, 
                $request->assigned_users);
        
        if(!$test){
            DB::rollBack();
            return response()->json([
                'title' => 'Examen Cancelado',
                'message' => 'Error al modificar el Test',
                'code' => $this->prefix . 'X502'
            ], 400);
        }

        DB::commit();

        return response()->json([
            'title' => 'Proceso terminado',
            'message' => 'Prueba actualizada exitosamente',
            'test' => $test
        ]);
        
    } catch (Exception $e) {

        DB::rollBack();
        return response()->json([
            'title' => 'Ocurrio un error en el servidor',
            'message' => $e->getMessage() . ' -L:' . $e->getLine(),
            'code' => $this->prefix . 'X699'
        ], 500);
    }
    }

    public function update(Request $request, string $id)
    {
        //
    }
    
    public function destroy(string $id)
    {
        try{
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X201'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);

            DB::beginTransaction();
            
            $test = Test::find($id);
    
            if (!$test) {
                return response()->json([
                    'title' => 'La Prueba no fue encontrado',
                    'message' => 'La Prueba con ID ' . $id . ' no existe.',
                    'code' => $this->prefix . 'X203'
                ], 404);
            }
            $userEvaluationIds = UserEvaluation::select('user_evaluation_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $id)
            ->pluck('user_evaluation_id')
            ->toArray();
            UserEvaluation::whereIn('id', $userEvaluationIds)->delete();
            UserTest::whereIn('user_evaluation_id', $userEvaluationIds)->delete();
            $test->delete(); // SoftDelete
    
            DB::commit();

            
            return response()->json([
                'title' => 'Prueba eliminada',
                'message' => 'La Prueba con ID ' . $id . ' ha sido eliminado.',
            ]);
        }

        catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);  
        }      
    }
}
