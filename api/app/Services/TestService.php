<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\ServiceProvider;

class TestService extends ServiceProvider
{
    static function getClasification($actual_score)
    {

        $clasification = collect();

        switch ($actual_score) {

                // En riesgo
            case $actual_score < 70:
                $clasification = [
                    "clasification" => "En riesgo",
                    "description" => "El colaborador ha tenido un rendimiento significativamente por debajo de las expectativas, tiene áreas de mejoras claramente identificadas, mismas que se le han indicado por medio de retroalimentación, necesidad urgente de intervención y desarrollo."
                ];

                break;

                // Baja
            case $actual_score > 69 && $actual_score < 80:
                $clasification = [
                    "clasification" => "Baja",
                    "description" => "El colaborador tuvo un desempeño insatisfactorio en varias áreas clave, así como el incumplimiento en sus metas y objetivos, requiere acciones correctivas para evitar consecuencias negativas."
                ];

                break;

                // Regular
            case $actual_score > 79 && $actual_score < 90:
                $clasification = [
                    "clasification" => "Regular",
                    "description" => "El colaborador ha tenido un cumplimiento básico de responsabilidades y expectativas, muestra competencias en algunas áreas pero con espacio para mejora. Cumple con las expectativas mínimas pero hay oportunidades para el crecimiento."
                ];

                break;

                // Buena
            case $actual_score > 89 && $actual_score < 100:
                $clasification = [
                    "clasification" => "Buena",
                    "description" => "El colaborador ha tenido un rendimiento sólido y consistente, cumple y en algunos casos supera las expectativas en su rol. Demuestra habilidades y competencias efectivas en la mayoría de las áreas."
                ];

                break;

                // Excelente
            case $actual_score > 99 && $actual_score < 120:
                $clasification = [
                    "clasification" => "Excelente",
                    "description" => "El colaborador excede consistentemente las expectativas, muestra un desempeño excepcional y contribuye de manera significativa al equipo y a los objetivos de la organización, tiene un alto sentido de compromiso."
                ];

                break;

                // Máxima
            case $actual_score == 120:
                $clasification = [
                    "clasification" => "Máxima",
                    "description" => "El colaborador tiene un desempeño excepcionalmente destacado en todas las áreas . Ha hecho contribuciones significativas que impactan positivamente en el equipo y en la organización en general, el colaborador muestra competencias que refieren estar listo para ser promovido."
                ];

                break;
        }

        return $clasification;
    }
}
