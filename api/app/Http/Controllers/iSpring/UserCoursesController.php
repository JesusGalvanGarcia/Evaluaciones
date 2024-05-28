<?php

namespace App\Http\Controllers\iSpring;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class UserCoursesController extends Controller
{

    public function index()
    {
        try {

            $token = Http::withoutVerifying()
                ->asForm()
                ->withHeaders([
                    'Accept' => '*/*'
                ])
                ->timeout(30)
                ->post(
                    'https://api-learn.ispringlearn.com/api/v3/token',
                    [
                        'client_id' => '1b6ae24f-19fc-11ef-be5a-cabf1d00afcb',
                        'client_secret' => 'oFiIQUDYZPnNYttDtx7RVTSaD_e9mhHERmO2JW2Db-c',
                        'grant_type' => 'client_credentials'
                    ]
                );

            // Maneja la respuesta
            if ($token->failed()) {

                return response()->json([
                    'error' => 'Failed to fetch token',
                    'details' => $token->body()
                ], $token->status());
            }

            $token_response = json_decode($token, true);

            $user_courses = Http::withoutVerifying()
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token_response['access_token'],
                    'Content-Type' => 'application/json'
                ])
                ->timeout(30)
                ->get(
                    'https://api-learn.ispringlearn.com/learners/results',
                    [
                        'userIds[]' => request('user_ispring_id')
                    ]
                );

            if ($user_courses->failed()) {

                return response()->json([
                    'error' => 'Error al consultar cursos',
                    'details' => $user_courses
                ], $token->status());
            }

            // Obtiene el contenido XML de la respuesta
            $xmlContent = $user_courses->body();

            // Convierte el XML a un objeto SimpleXMLElement
            $xmlObject = simplexml_load_string($xmlContent);

            // Convierte el objeto SimpleXMLElement a un array
            $array = json_decode(json_encode($xmlObject), true);

            // Retorna el array como JSON
            return response()->json(!$this->isAssociativeArray($array['results']['result']) ? $array['results'] : ['result' => [$array['results']['result']]]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Error en el servidor',
                'message' => $e->getMessage() . '-L:' . $e->getLine()
                // 'code' => $this->prefixCode . 'X099'
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

    private function isAssociativeArray($array)
    {
        return is_array($array) && (array_keys($array) !== range(0, count($array) - 1));
    }
}
