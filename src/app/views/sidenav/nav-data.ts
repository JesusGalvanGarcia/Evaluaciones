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
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        items: [
            {
                routeLink: 'exam',
                label: 'PLD',
            },
            {
                routeLink: 'exam/adminPld',
                label: 'Administración de PLD',
            },
        ]
    },
    {
        routeLink: 'logout',
        icon: 'fa-solid fa-arrow-left-long',
        label: 'Cerrar Sesion'
    },
];