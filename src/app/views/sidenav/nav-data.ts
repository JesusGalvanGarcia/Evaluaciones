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
                icon:'fa-solid fa-pen-to-square'
            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
    },
    {
        routeLink: 'logout',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];