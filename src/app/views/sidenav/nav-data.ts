import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-home',
        label: 'Home'
    },
    
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
             
            },
            {
                routeLink: 'evaluations/360',
                label: '360',
            },
            {
                routeLink: 'evaluations/evaluacion',
                label: 'Crear Evaluacion',
             
            },
        ]
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-gear',
        label: 'Configuracion'
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];