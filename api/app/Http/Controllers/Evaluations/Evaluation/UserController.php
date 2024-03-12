<?php

namespace App\Http\Controllers\Evaluations\Evaluation;

use App\Http\Controllers\Controller;

use App\Models\Evaluation;
use App\Models\User;
use App\Services\Evaluations\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    private $prefix = 'User';

    public function index()
    {
        try {

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefix . 'X001'
                ], 400);

            $users = User::select(
                'users.id',
                'A.name as area_name',
                DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as complete_name"),
            )
                ->join('areas as A', 'A.id', 'users.area_id')
                ->orderBy('A.name', 'asc')
                ->get();

            return response()->json([
                'title' => 'Proceso Correcto',
                'message' => 'Usuarios consultadas correctamente',
                'users' => $users
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => '',
                'message' => $e->getMessage(),
                'code' => $this->prefix . 'X009',
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function sendPasswordResetEmail(Request $request)
    {
        try{
        $request->validate(['email' => 'required|email']);
        
        $user = User::where([
            ['email', $request->email]
        ])
        ->first();
        if (!$user) {

            return response()->json([
                'title' => 'Error de Validación',
                'message' => 'Usuario o contraseña incorrecto, intente de nuevo.',
                'code' => $this->prefixCode . 'X002'
            ], 400);
        }
        $decodedEmail = Crypt::encryptString($request->email);
     
        TestService::sendEmailReset($user->name,$request->email,$decodedEmail);
        
        return response()->json([
            'message' => 'El correo fue enviado con exito',
 
        ], 200);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X099'
            ], 500);
        }
        }
        public function resetPassword(Request $request)
        {
            try{
            $decodedEmail = Crypt::decryptString($request->email);
            
            $user = User::where([
                ['email', $decodedEmail],
            ])
            ->first();
            if (!$user) {
    
                return response()->json([
                    'title' => 'Error de Validación',
                    'message' => 'Usuario o contraseña incorrecto, intente de nuevo.',
                    'code' => $this->prefix . 'X002'
                ], 400);
            }
            $hashedPassword = Hash::make($request->password);

            $user->update([
                'password' => $hashedPassword
            ]);
            
            
            return response()->json([
                'message' => 'La contraseña se cambio correctamente',
     
            ], 200);
            } catch (Exception $e) {
    
                return response()->json([
                    'title' => 'Ocurrio un error en el servidor',
                    'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                    'code' => $this->prefix . 'X099'
                ], 500);
            }
            }
}
