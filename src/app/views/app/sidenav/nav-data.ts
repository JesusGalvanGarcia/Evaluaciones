import { CanActivate } from '@angular/router';
import { INavbarData } from "./helper";
import {AuthGuardService} from "../../../shared/http/auth.service";

export const navbarData: INavbarData[] = [    
 
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        menu_items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
      

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
           

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
           

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        menu_items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
         
            },
        
        ]
        
    }
  
];
export const navbarDataAdmin: INavbarData[] = [    
 
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        menu_items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
       

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
             

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
           

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        menu_items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
           
            },
            {
                icon: 'fa-solid fa-toolbox',
                routeLink: 'exam/adminPld',
                label: 'Administración de PLD',
              
              }
        ]
        
    },

];
export const navbarDataAdminEvaluaciones: INavbarData[] = [    
  
  
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-user-tie',
        label: 'Administración',
        menu_items: [
            {
                routeLink: 'admin360',
                label: 'Evaluaciones 360',
                icon: 'fa-solid fa-pen-to-square',
          

            },
            {
                routeLink: 'asesoresAdmin',
                label: 'Asesores',
                icon: 'fa-solid fa-pen-to-square',
   

            },
        ]
        
    },
    {
        routeLink: 'dashboard',
        icon: 'fa-regular fa-newspaper',
        label: 'Evaluaciones',
        menu_items: [
            {
                routeLink: 'evaluacion',
                label: 'Desempeño',
                icon: 'fa-solid fa-pen-to-square',
      

            },
            {
                routeLink: 'evaluacion360',
                label: 'Evaluacion 360',
                icon: 'fa-regular fa-folder-open',
         

            },
            {
                routeLink: 'asesores',
                label: 'Evaluacion asesores',
                icon: 'fa-solid fa-person-walking-luggage',
         

            },
        ]
    },
    {
        routeLink: 'exam',
        icon: 'fa-solid fa-money-bill',
        label: 'PLD',
        menu_items: [
            {
                icon: 'fa-solid fa-file-invoice',
                routeLink: 'exam',
                label: 'PLD',
  
            },
        ]
        
    },
 
];
