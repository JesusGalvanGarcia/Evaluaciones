import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { LoadingComponent } from '../../../app/loading/loading.component';

import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { Evaluation360Service } from '@services/Evaluations/Evaluation360/evaluation360.service';

@Component({
  selector: 'app-AdminAsesores',
  templateUrl: './AdminAsesores.component.html',
  styleUrls: ['./AdminAsesores.component.css'],
  standalone:true,
  imports: [LoadingComponent,MatMenuModule,CommonModule,MatIconModule,MatCardModule,GridModule,MatBadgeModule,MatDialogModule]

})
export class AdminAsesoresComponent implements OnInit {

  evaluationData: any;
  UsersData: any;
  isLoading: boolean = true;
  start:boolean=false;
  evaluationNumber:number;
  ​
  public seeDetailButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Report,
          icon: 'fa-solid fa-arrow-right',
          title:'Ir a reportes'
       
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public seeDetailSeenButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Acept,
          icon: 'fa-solid fa-thumbs-up',
          title:'Ver detalles de reporte'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public goClients:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Continue,
          icon: 'fa-solid fa-plus',
          title:'Clientes internos'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  protected columnDefs: ColDef[] = [
    { headerName: 'Nombre', field: 'name',  },
    { headerName: 'Inicio', field: 'start_date',  },
    { headerName: 'Fin', field: 'end_date',},
    this.goClients
  
  ]
  protected columnDefsUsers: ColDef[] = [
    { headerName: 'Nombre', field: 'collaborator_name',  },
    { headerName: 'Evaluación', field: 'evaluation_name',  },
    { headerName: 'Estatus', field: 'status_label',  },

    this.seeDetailSeenButton,
    this.seeDetailButton
  
  ]
​
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public router:Router,
    private evaluations:  Evaluation360Service,
    public message: MensajeService) { }
  startModal = true; // o false, dependiendo de tu lógica
  modalOpen = false;

  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    if(localStorage.getItem("page_evaluation")!="")
    {
      this.start=true;
      this.evaluationNumber=Number(localStorage.getItem("page_evaluation"));
      this.getUsers(data,this.evaluationNumber);
    }else
    this.getExamns(data);
  
  }
  getExamns(data: any) {
 

    this.evaluations.Get360(data)  //Cargar examen
      .then((response: any) => {
      
        this.evaluationData = response.evaluations.filter((evaluation:any) =>Number(evaluation.process_id)== 6);
       

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar las evaluaciones "+error);
        // Handle errors here
      });
  }
  getUsers(data: any,id:any) {
 

    this.evaluations.GetUsers360(data,id)  //Cargar examen
      .then((response: any) => {
       
        this.UsersData = response.users;

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar las evaluaciones "+error);
        // Handle errors here
      });
  }
  back()
  {
    this.start=false;
    this.isLoading=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    this.getExamns(data);
    localStorage.setItem("page_evaluation","");
    this.isLoading=false;
  }
  protected onActionEvent(actionEvent: { action: string, data: any }) {
    if (actionEvent.action == GridActions.Report )  //verificar si no han finalizado los intentos
      {
        this.start=true;
        this.evaluationNumber=actionEvent.data.id;
        let data = {
          user_id: Number(localStorage.getItem("user_id")),
    
        };
        this.getUsers(data,this.evaluationNumber);
      }
      if (actionEvent.action == GridActions.Continue )  //verificar si no han finalizado los intentos
      {
        this.router.navigate(['/dashboard/asesoresUsers/' + actionEvent.data.id]);

      }

  }

  protected onActionEventUser(actionEvent: { action: string, data: any }) {

      if (actionEvent.action == GridActions.Report )  //verificar si no han finalizado los intentos
      {
        localStorage.setItem("collaborator_name", actionEvent.data.collaborator_name);
        localStorage.setItem("admin", "true");

        this.router.navigate(['/dashboard/personal360/' + this.evaluationNumber + "/" + actionEvent.data.collaborator_id]);
        
      }
   
  }
  

}
