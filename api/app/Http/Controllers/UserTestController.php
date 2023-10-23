<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Test;
use App\Models\UserAnswer;
use App\Models\UserTest;
use App\Models\UserTestModule;
use App\Services\UserService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Type\Integer;

class UserTestController extends Controller
{
    private $prefix = 'UserTest';

    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        //
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

            // Se valida si el usuario tiene asignada la prueba y si existe.
            $user_test = UserTest::find($id);

            if (!$user_test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X203'
                ], 400);

            // Se consulta la prueba que tiene asignada el usuario y se valida que exista
            $test = Test::select(
                'id',
                'evaluation_id',
                'name',
                'introduction_text',
                'max_score',
                'min_score',
                'modular'
            )
                ->with([
                    'modules' => function ($query) use ($id) {
                        $query->select(
                            'id',
                            'name',
                            'test_id',
                            DB::raw("(select note from user_test_modules as UTM where UTM.user_test_id = $id AND UTM.module_id = id AND deleted_at is null) AS 'note'")
                        );

                        $query->with([
                            'questions' => function ($query) use ($id) {
                                $query->select('id', 'description', 'score', 'module_id');

                                $query->with([
                                    'answers' => function ($query) use ($id) {
                                        $query->select(
                                            'id',
                                            'description',
                                            'score',
                                            'question_id',
                                            DB::raw("(SELECT id from user_answers UA where user_test_id = $id AND UA.question_id = answers.question_id AND UA.answer_id = answers.id AND deleted_at is null) as 'user_answer_id'")
                                        )
                                            ->orderBy('score', 'desc');
                                    }
                                ]);
                            }
                        ]);
                    }
                ])
                ->find($user_test->test_id);

            if (!$test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X204'
                ], 400);

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba del usuario consultado correctamente',
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

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }

    public function saveAnswers(Request $request)
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

            //Se valida el estado de la evaluación
            if (!UserTest::whereIn('status_id', [1, 2])->find($request->user_test_id))
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X503'
                ], 400);

            $total_score = 0;

            DB::beginTransaction();

            foreach ($request->modules as $module) {

                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $module['id'],
                    'note' => $module['note']
                ]);

                foreach ($module['answers'] as $answer) {

                    UserAnswer::create([
                        'user_test_id' => $request->user_test_id,
                        'question_id' => $answer['question_id'],
                        'answer_id' => $answer['id']
                    ]);

                    $total_score += $answer['score'];
                }
            }

            UserTest::find($request->user_test_id)->update([
                'status_id' => 3,
                'finish_date' => Carbon::now()->format('Y-m-d'),
                'total_score' => $total_score,
                'updated_by' => $request->user_id
            ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuestas guardadas correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X599'
            ], 500);
        }
    }

    public function saveAnswer(Request $request)
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
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_answer_id' => 'Nullable|Integer|NotIn:0|Min:0',
                'question_id' => 'Required|Integer|NotIn:0|Min:0',
                'answer_id' => 'Required|Integer|NotIn:0|Min:0',
                'score' => 'Required|Integer|NotIn:0|Min:0',
                'its_over' => 'Required|In:si,no',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X602'
                ], 400);

            //Se valida el estado de la prueba
            $user_test = UserTest::whereIn('status_id', [1, 2])->find($request->user_test_id);

            if (!$user_test)
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X603'
                ], 400);

            // Se iguala el score actual de la prueba
            $total_score = $user_test->total_score;

            DB::beginTransaction();

            // Se consulta la ultima pregunta respondida del usuario en caso de que se tenga
            $last_user_answer = UserAnswer::where([
                ['user_test_id', $request->user_test_id],
                ['question_id', $request->question_id],
            ])->first();

            if ($last_user_answer) {

                if ($last_user_answer->answer_id != $request->answer_id) {

                    $last_user_answer->delete();

                    // Si no se tenia respuesta guardada de la pregunta se crea
                    UserAnswer::create([
                        'user_test_id' => $request->user_test_id,
                        'question_id' => $request->question_id,
                        'answer_id' => $request->answer_id
                    ]);
                }

                $total_score -= $last_user_answer->answer->score;
            } else {

                // Si no se tenia respuesta guardada de la pregunta se crea
                UserAnswer::create([
                    'user_test_id' => $request->user_test_id,
                    'question_id' => $request->question_id,
                    'answer_id' => $request->answer_id
                ]);
            }

            $user_test->update([
                'status_id' => $request->its_over == 'yes' ? 3 : 2,
                'finish_date' => $request->its_over == 'yes' ? Carbon::now()->format('Y-m-d') : null,
                'total_score' => (int)$total_score + (int)$request->score,
                'updated_by' => $request->user_id
            ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuesta guardada correctamente'
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

    public function saveModuleNote(Request $request)
    {

        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P007'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
                'module_id' => 'Nullable|Integer|NotIn:0|Min:0',
                'note' => 'Required|String',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X701'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X702'
                ], 400);

            //Se valida el estado de la prueba
            $user_test = UserTest::whereIn('status_id', [1, 2])->find($request->user_test_id);

            if (!$user_test)
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X703'
                ], 400);

            DB::beginTransaction();

            $user_test_module = UserTestModule::where([
                ['user_test_id', $request->user_test_id],
                ['module_id', $request->module_id]
            ])->first();

            if ($user_test_module)
                $user_test_module->update([
                    'note' => $request->note
                ]);

            else
                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $request->module_id,
                    'note' => $request->note
                ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Nota guardada correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X799'
            ], 500);
        }
    }
}