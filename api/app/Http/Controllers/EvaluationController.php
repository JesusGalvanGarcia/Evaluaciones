<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Services\UserService;
use Exception;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{

    private $prefix = 'Evaluations';

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

            $evaluations = Evaluation::get();

            return response()->json([
                'title' => 'Proceso Correcto',
                'message' => 'Evaluaciones consultadas correctamente',
                'evaluations' => $evaluations
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
