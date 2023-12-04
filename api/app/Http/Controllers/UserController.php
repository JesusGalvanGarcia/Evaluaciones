<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\User;
use App\Services\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}
