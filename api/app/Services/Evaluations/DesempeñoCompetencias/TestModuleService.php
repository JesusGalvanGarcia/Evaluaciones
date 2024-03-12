<?php

namespace App\Services\Evaluations\DesempeñoCompetencias;


use App\Models\TestModule;
use Illuminate\Support\ServiceProvider;

class TestModuleService extends ServiceProvider
{
    public static function createTestModule($test_id, $module_name, $user_id){
        $test_module = TestModule::create([
            'test_id' => $test_id,
            'name' => $module_name,
            'created_by' => $user_id,
            'updated_by' => $user_id,
        ]);
        return $test_module;
    }
}