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
import { LoadingComponent } from '../loading/loading.component';

import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { Evaluation360Service } from '@services/evaluation360.service';
@Component({
  selector: 'app-Admin360',
  templateUrl: './Admin360.component.html',
  styleUrls: ['./Admin360.component.css'],
  standalone:true,
  imports: [LoadingComponent,MatMenuModule,CommonModule,MatIconModule,MatCardModule,GridModule,MatBadgeModule,MatDialogModule]

})
export class Admin360Component implements OnInit {
  
  evaluationData: any;
  UsersData: any;
  UsersPersonalData: any;

  isLoading: boolean = true;
  start:boolean=false;
  detail:boolean=false;
  evaluationNumber:number;
  ​
  public seeDetailButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Report,
          icon: 'fa-solid fa-arrow-right',
          title:'Ir a reporte'
       
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
          icon: 'fa-solid fa-paper-plane',
          title:'Aprobar reporte'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public seeDetailUser:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Seen,
          icon: 'fa-solid fa-eye',
          title:'Ver detalles'
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
          icon: 'fa-solid fa-user-plus',
          title:'Asignar clientes internos'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public goUsers:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.AddClient,
          icon: 'fa-solid fa-users',
          title:'Asignar usuarios a la evaluación'
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
    this.seeDetailButton,
    this.goClients,
    this.goUsers
  
  ]
  protected columnDefsUsers: ColDef[] = [
    { headerName: 'Nombre', field: 'collaborator_name',  },
    { headerName: 'Evaluación', field: 'evaluation_name',  },
    { headerName: 'Estatus', field: 'status_label',  },

    this.seeDetailSeenButton,
    this.seeDetailButton,
    this.seeDetailUser
  
  ]
​  protected columnDefsPersonalUser: ColDef[] = [
  { headerName: 'Nombre', field: 'responsable_name',  },
  { headerName: 'Evaluación', field: 'evaluation_name',  },
  { headerName: 'Estatus', field: 'status',  },
  { headerName: 'Evaluador', field: 'evaluator_type',  },
]
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
    this.isLoading=true;
    console.log(data)
    this.evaluations.Get360(data)  //Cargar examen
      .then((response: any) => {
        console.log(response)
        this.evaluationData = response.evaluations.filter((evaluation:any) =>Number(evaluation.process_id)== 7||Number(evaluation.process_id)== 10||Number(evaluation.process_id)== 11);;
        console.log(this.evaluationData)

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
 
    console.log(data)
    this.isLoading=true;
    this.evaluations.GetUsers360(data,id)  //Cargar examen
      .then((response: any) => {
        console.log(response)
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
  getUserPersonal(data: any) {
    this.isLoading=true;
    console.log(data)
    this.evaluations.getPersonal360(data)  //Cargar examen
      .then((response: any) => {
        console.log(response)
        this.UsersPersonalData = response.users;

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
  backPersonal()
  {
    this.start=false;
    this.detail=false;
    this.start=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
    };
    this.getUsers(data,this.evaluationNumber);
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
        this.router.navigate(['/dashboard/users360/' + actionEvent.data.id]);

      }
      if (actionEvent.action == GridActions.AddClient )  //verificar si no han finalizado los intentos
      {
        this.router.navigate(['/dashboard/360Users/' + actionEvent.data.id]);

      }
  }
  postApproved(id:any)
  {
    this.isLoading=true;
    let data = {
      user_id: id,
      evaluation_id:this.evaluationNumber
    };
    console.log(data)
    this.evaluations.changeStatus(data)
    .then((response: any) => {
     this.message.success("El  reporte se ha aprobado con exito");
     this.getUsers(data,this.evaluationNumber);
     this.isLoading=false;
    })
    .catch((error: any) => {
      console.error('Error in the request:', error);
      this.message.error("Hubo un error al aprobar el reporte"+error);
      this.isLoading=false;
      // Handle errors here
    });
  }
  protected onActionEventUser(actionEvent: { action: string, data: any }) {

      if (actionEvent.action == GridActions.Report )  //verificar si no han finalizado los intentos
      {
        localStorage.setItem("collaborator_name", actionEvent.data.collaborator_name);
        localStorage.setItem("admin", "true");

        this.router.navigate(['/dashboard/exam/personal360/' + this.evaluationNumber + "/" + actionEvent.data.collaborator_id]);
        
      }
      if (actionEvent.action == GridActions.Acept )  //verificar si no han finalizado los intentos
      {

        this.postApproved(actionEvent.data.collaborator_id);      
      }
      if (actionEvent.action == GridActions.Seen )  //verificar si no han finalizado los intentos
      {
        let data = {
          user_id: Number(actionEvent.data.collaborator_id),
          collaborators_id: [],
          evaluations_id: []
        };
        this.start=false;
        this.detail=true; 
        this.getUserPersonal(data);
      
      }
  }
  

}
