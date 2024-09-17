<?php

namespace App\Http\Controllers\iSpring;

use App\Http\Controllers\Controller;
use App\Services\Evaluations\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Services\iSpring\iSpringService;

use SimpleXMLElement;
use Exception;

class CursosController extends Controller
{

    private $prefix = 'iSpring-Courses';

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

            // Se consulta el token de acceso a la API de iSpring Learn
            $token = iSpringService::getToken();

            // Maneja la respuesta
            if ($token->failed()) {

                return response()->json([
                    'error' => 'Failed to fetch token',
                    'details' => $token->body(),
                    'code' => $this->prefix . 'X002'
                ], $token->status());
            }

            $token_response = json_decode($token, true);

            $courses = Http::withoutVerifying()
                ->asForm()
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token_response['access_token'],
                    'Content-Type' => 'application/json'
                ])
                ->timeout(30)
                ->get(
                    'https://api-learn.ispringlearn.com/content',
                    []
                );

            if ($courses->failed()) {

                return response()->json([
                    'error' => 'Error al consultar cursos',
                    'details' => $courses
                ], $token->status());
            }

            // Obtiene el contenido XML de la respuesta
            $xmlContent = $courses->body();

            // Convierte el XML a un objeto SimpleXMLElement
            $xmlObject = simplexml_load_string($xmlContent);

            // Convierte el objeto SimpleXMLElement a un array
            $array = json_decode(json_encode($xmlObject), true);

            // Retorna el array como JSON
            return response()->json($array);
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
                        'client_id' => '0bc6d201-66de-11ef-8eab-723f2a388c99',
                        'client_secret' => 'x5SnWUwzrz-U41KrTmOk0xrW-iKi4x9RDfKTk-B6lds',
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

            $courses = Http::withoutVerifying()
                ->asForm()
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token_response['access_token'],
                    'Content-Type' => 'application/json'
                ])
                ->timeout(30)
                ->get(
                    'https://api-learn.ispringlearn.com/content/' . $id,
                    []
                );

            if ($courses->failed()) {

                return response()->json([
                    'error' => 'Error al consultar cursos',
                    'details' => $courses
                ], $token->status());
            }

            // Obtiene el contenido XML de la respuesta
            $xmlContent = $courses->body();

            // Convierte el XML a un objeto SimpleXMLElement
            $xmlObject = simplexml_load_string($xmlContent);

            // Convierte el objeto SimpleXMLElement a un array
            $array = json_decode(json_encode($xmlObject), true);

            // Retorna el array como JSON
            return response()->json($array);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Error en el servidor',
                'message' => $e->getMessage() . '-L:' . $e->getLine()
                // 'code' => $this->prefixCode . 'X099'
            ], 500);
        }
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
