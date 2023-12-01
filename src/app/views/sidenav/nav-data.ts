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
        label: 'PLD',
        icon: 'fa-regular fa-newspaper',
        items: [
            {
                routeLink: 'pld',
                label: 'PLD',
            },
            {
                routeLink: 'pld/adminPld',
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