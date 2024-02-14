import { CanActivate } from '@angular/router';
import { INavbarData } from "./helper";
import {AuthGuardService} from "../../shared/http/auth.service";

export const navbarData: INavbarData[] = [    
    {
        routeLink: 'exam/home',
        icon: 'fa-solid fa-house',
        label: 'Home',
        
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
                active:true,

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
                active:true,

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
                active:true,

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
                active:true,
            },
        
        ]
        
    },
    {
        routeLink: 'logout',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];
export const navbarDataAdmin: INavbarData[] = [    
    {
        routeLink: 'exam/home',
        icon: 'fa-solid fa-house',
        label: 'Home',
        
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
                active:true,

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
                active:true,

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
                active:true,

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
                active:true,
            },
            {
                icon: 'fa-solid fa-toolbox',
                routeLink: 'exam/adminPld',
                label: 'Administración de PLD',
              
              }
        ]
        
    },
    {
        routeLink: 'logout',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];
export const navbarDataAdminEvaluaciones: INavbarData[] = [    
    {
        routeLink: 'exam/home',
        icon: 'fa-solid fa-house',
        label: 'Home',
        
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-user-tie',
        label: 'Administración',
        items: [
            {
                routeLink: 'admin360',
                label: 'Evaluaciones 360',
                icon: 'fa-solid fa-pen-to-square',
                active:true,

            },
            {
                routeLink: 'asesoresAdmin',
                label: 'Asesores',
                icon: 'fa-solid fa-pen-to-square',
                active:true,

            },
        ]
        
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
                active:true,

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
                active:true,

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
                active:true,

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
                active:true,
            },
        ]
        
    },
    {
        routeLink: 'logout',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];
