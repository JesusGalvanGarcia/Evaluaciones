<?php

use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ToolsController;
use App\Http\Controllers\UserActionPlanController;
use App\Http\Controllers\UserEvaluationController;
use App\Http\Controllers\PLDUsersController;
use App\Http\Controllers\UserTestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Aws\S3\S3Client;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [LoginController::class, 'login'])->name('login');
//Route::get('/PLDUser', [PLDUserController::class, 'index'])->name('index');
Route::resource('/PLDUser', PLDUsersController::class, [
    'names' => [
        'index' => 'Consultar examenes pld del Usuario',
        'show' => 'Consultar Detalle de las Evaluaciones del Usuario',

    ]
]);

Route::resource('/evaluations', EvaluationController::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones',
        'store' => 'Registrar Evaluaciones',
        'show' => 'Consultar Detalle de la Evaluación',
        'update' => 'Actualizar Evaluación',
        'destroy' => 'Borrar Evaluaciones'
    ]
]);

Route::resource('/user-evaluations', UserEvaluationController::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones del Usuario',
        'store' => 'Registrar Evaluaciones al Usuario',
        'show' => 'Consultar Detalle de las Evaluaciones del Usuario',
        'update' => 'Actualizar Evaluaciones del Usuario',
        'destroy' => 'Borrar Evaluaciones del Usuario'
    ]
]);


// Route::post('/user-tests/saveAnswers', [UserTestController::class, 'saveAnswers'])->name('Guardar Respuestas del Usuario');
Route::post('/user-tests/saveAnswer', [UserTestController::class, 'saveAnswer'])->name('Guardar Respuesta del Usuario');
Route::post('/PLDUser/saveAnswerPLD', [PLDUsersController::class, 'saveAnswerPLD'])->name('Guardar Respuesta del Usuario');

Route::post('/user-tests/saveModuleNote', [UserTestController::class, 'saveModuleNote'])->name('Guardar nota del modulo');
Route::post('/user-tests/changeProcess', [UserTestController::class, 'changeProcess'])->name('Cambiar de proceso');
Route::resource('/user-tests', UserTestController::class, [
    'names' => [
        'index' => 'Consultar Pruebas del Usuario',
        'store' => 'Registrar Pruebas del Usuario',
        'show' => 'Consultar Detalle de las Pruebas del Usuario',
        'update' => 'Actualizar Pruebas del Usuario',
        'destroy' => 'Borrar Pruebas del Usuario'
    ]
]);

Route::post('/user-actionPlan/confirmActionPlan', [UserActionPlanController::class, 'confirmActionPlan'])->name('Confirmar Plan de Acción');
Route::post('/user-actionPlan/storeSignature', [UserActionPlanController::class, 'storeSignature'])->name('Guardar Firma del Usuario');
Route::resource('/user-actionPlan', UserActionPlanController::class, [
    'names' => [
        'index' => 'Consultar Planes de Acción del Usuario',
        'store' => 'Registrar Plan de Acción del Usuario',
        'show' => 'Consultar Detalle Plan de Acción del Usuario',
        'update' => 'Actualizar Plan de Acción del Usuario',
        'destroy' => 'Borrar Plan de Acción del Usuario'
    ]
]);

Route::get('/tools/permissions', [ToolsController::class, 'permissions'])->name('Consultar Permisos');
Route::post('/tools/permissions/create', [ToolsController::class, 'storePermissions'])->name('Crear Permisos');
Route::post('/tools/permissions/assign', [ToolsController::class, 'assignPermissions'])->name('Asignar Permisos');
Route::post('/tools/permissions/check', [ToolsController::class, 'checkPermission'])->name('Comprobar Permisos');
Route::get('/tools/roles', [ToolsController::class, 'roles'])->name('Consultar Roles');
Route::get('/tools/roles/get', [ToolsController::class, 'role'])->name('Consultar Roles');
Route::post('/tools/roles/create', [ToolsController::class, 'storeRoles'])->name('Crear Roles');
Route::post('/tools/roles/assign', [ToolsController::class, 'assignRoles'])->name('Asignar Roles');
