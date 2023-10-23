import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [    
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
             
            },
        ]
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];