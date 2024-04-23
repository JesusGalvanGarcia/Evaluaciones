<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;

class LoginController extends Controller
{
    private $prefixCode = 'Login';

    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'Required|Email',
                'password' => 'Required|String'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X001'
                ], 400);
            }

            // Consulta de usuario en base a authentication
            $user = User::where([
                ['email', $request->email]
            ])
                ->whereIn('status_id', [1, 3])
                ->first();
        
            if (!$user) {

                return response()->json([
                    'title' => 'Error de Validación',
                    'message' => 'Usuario o contraseña incorrecto, intente de nuevo.',
                    'code' => $this->prefixCode . 'X002'
                ], 400);
            }
           $permissions= $user->getAllPermissions()->pluck('name');
           
            if(count($permissions)==0)
            {
                return response()->json([
                    'title' => 'Error de Validación',
                    'message' => 'No tienes permiso para ingresar.',
                    'code' => $this->prefixCode . 'X003'
                ], 400);
            }
            // Consulta de permisos de la plataforma
            // $permissions = $user->hasAnyPermission([
            //     29,
            //     30,
            //     31,
            //     32
            // ]);

            // if (!$permissions) {
            //     return response()->json([
            //         'message' => 'No estas autorizado para entrar a esta plataforma'
            //     ], 404);
            // }

            //Consulta del internal_user en base a modelo
            // if (!$user->roles->first())
            //     return response()->json([
            //         'title' => 'Acceso denegado',
            //         'message' => 'No estas autorizado para entrar a esta plataforma',
            //         'code' => $this->prefixCode . 'X003'
            //     ], 404);

            $log_Data = [
                'user_id' => $user->id,
                'user_name' => $user->name." ".$user->father_last_name,
                'email' => $user->email,
                // 'role' => $user->roles->first()->id
            ];

            $log_on = Request::create(
                '/oauth/token',
                'POST',
                [
                    'grant_type' => 'password',
                    //Claves test
                    // 'client_id' => 3,
                    // 'client_secret' => 'Gm5iIkZgXEMtRQmnAAnZowjse4CLekCr0WrRu8EX',
                    // Claves prod
                    'client_id' => 3,
                    'client_secret' => 'URUse7nyxi8yzrbV8RQvpaHC4Ogtsg6tMEBJ2lKN',
                    'username' => $request->email,
                    'password' => $request->password,
                    'scope' => '',
                ]
            );

            $response = app()->handle($log_on);
            
            $content = json_decode($response->getContent(), true);

            if (array_key_exists('error', $content)) {

                return response()->json([
                    'title' => 'Error de Validación',
                    'message' => 'Usuario o contraseña incorrecto, intente de nuevo.',
                    'code' => $this->prefixCode . 'X005'
                ], 400);
            }

            return response()->json([
                'title' => 'Login Correcto',
                'message' => 'Bienvenido',
                'data' => $log_Data,
                'token' => $content['access_token'],
                'expiresIn' => $content['expires_in']
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X099'
            ], 500);
        }
    }

}
