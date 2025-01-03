import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { AgGridModule } from 'ag-grid-angular';
import { CollaboratorEvaluation } from '@models/colaboradorEvaluation/colaboradorEvaluation';
import { TestModel } from '@models/colaboradorEvaluation/evaluationDetail';
import { ProcessModel } from "../../../../shared/entities/models/testDetails/processModel";
import { UserEvaluationService } from "../../../../shared/services/Evaluations/Desempeño/userEvaluation.service";
import { LoadingComponent } from '../../../app/loading/loading.component';
import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';
import { Evaluation360Service } from '@services/Evaluations/Evaluation360/evaluation360.service';
import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-index360',
  standalone:true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatTooltipModule,
    MatSelectModule,
    GridModule,
    MatInputModule, 
    LoadingComponent,
    MatTabsModule,
    FormsModule,
    CdkTableModule,
    AgGridModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './index360.component.html',
  styleUrls: ['./index360.component.css']
})
export class Index360Component implements OnInit {

  protected  isChecked: boolean = true;
  changeProcess:ProcessModel;
  ListChangeColaborator:CollaboratorEvaluation[];
  plans:boolean=false;
  planList:any;
  ListColaborator:CollaboratorEvaluation[];
  ListTest:TestModel[];
  mostrar:boolean=false;
  indexPos:number;
  showIframe: boolean = false;
  selectedOptions: string[] = [];
  options: string[] = ['Pendiente', 'Proceso', 'Terminado', 'Mis evaluaciones','Todas'];

  PersonalList:CollaboratorEvaluation[];
  protected isLoading: boolean = false;
  
  displayedColumns: string[] = [ 'evaluation_name', 'collaborator_name', 'actual_process', 'evaluator_type', 'status',"action"];
  dataSource: MatTableDataSource<TestModel> | any = [];
  constructor(private http: HttpClient,
    private userEvaluationService: UserEvaluationService,
    private router: Router,    
    public message:MensajeService,
    public userTestService: UserTestService,
    public evaluations360:Evaluation360Service    ) {}

    public seeDetailSeenButton:ColDef = Object.assign(
      {
        cellRendererSelector: (params: any) => {
          const component = { component: 'gridActionButton',
          params: { 
            action:  GridActions.Seen,   
            icon:'fa-solid fa-eye',
            title:' Ver' 
          }
        };
        return component;
        }
      },
      GridActions.DEFAULT_COLUMN
    )
    toggleIframe() {
      this.showIframe = !this.showIframe;
    }
    public seeDetailAccionPlan:ColDef = Object.assign(
      {
        cellRendererSelector: (params: any) => {
          const component = { component: 'gridActionButton',
          params: { 
            action:  GridActions.Start,   
            icon:'fa-solid fa-file-invoice',
            title:' Ver plan de acción' 
          }
        };
        return component;
        }
      },
      GridActions.DEFAULT_COLUMN
    )
    protected columnDefs: ColDef[] = [
      { headerName: 'Nombre', flex:1, field: 'collaborator_name', minWidth: 200  },
      { headerName: 'Evaluación', flex:1, field: 'evaluation_name', minWidth: 200 },
      { headerName: 'Inicio', flex:1, field: 'evaluation_start', minWidth: 200  },
      { headerName: 'Fin', flex:1, field: 'evaluation_end', minWidth: 200  },
      this.seeDetailSeenButton,
      this.seeDetailAccionPlan
    ]
    protected columnDefsPlans: ColDef[] = [
      { headerName: 'Nombre', flex:1, field: 'responsable_name', minWidth: 200  },
      { headerName: 'Fin', flex:1, field: 'finish_date', minWidth: 200  },
      this.seeDetailSeenButton
    ]
  getTestUser(data:any,userid:any,array:number)
  {
    this.evaluations360.GetTests360(data,userid)
    .then((response:any) => {
     
      this.mostrar=true;
      this.isLoading=false;
  
      this.ListColaborator[array].detail=response;
      
   
    }).catch((error:any) => {
      console.error('Error in the request:', error);
      this.message.error(error.message+" "+error.code);

    });
  }
  
  changeList()
  {
  
  
    
  }
    ngOnInit() {
      var user=localStorage.getItem("email");
      if(user=="")
      {
        this.router.navigate(['/login']);
        this.message.error("Tienes que iniciar sesion");
  
      }
  
      this.getTable();
    }
    toggleRow(row: any) {
      this.isLoading=true;
      row.isExpanded = !row.isExpanded;
      row.detail=[]
      let data = {
        user_id: Number(localStorage.getItem("user_id")),
        collaborators_id: [],
        evaluations_id: []
      };
      const posicion = this.ListColaborator.findIndex((elemento) => elemento.user_evaluation_id
      === row.user_evaluation_id    );
      this.indexPos=posicion;
      this.getTestUser(data,row.user_evaluation_id ,posicion);
      this.dataSource.data = [...this.dataSource.data];
  
  }
  get360(data:any)
  {
    this.evaluations360.getFinished(data)
    .then((response:any) => {
      this.PersonalList=response.users;
  
    })
    .catch((error:any) => {
      console.error('Error in the request:', error);
      this.message.error(error.message+" "+error.code);

      // Handle errors here
    });
  }
  getPlans(data:any)
  {
    this.isLoading=true;
    this.evaluations360.getPlans(data)
    .then((response:any) => {
     // this.PersonalList=response.users;
     this.planList=response.user_action_plan;
     this.isLoading=false;
     if(response.user_action_plan.length!=0)
     this.router.navigate(['/plan-accion/'+response.user_action_plan[0].id]);
     else
     this.message.error("No hay un plan acción disponible.");
    })
    .catch((error:any) => {
      console.error('Error in the request:', error);
      this.message.error(error.message+" "+error.code);

      // Handle errors here
    });
  }
  protected onActionEvent(actionEvent: { action: string, data: any }) {
    if (actionEvent.action == GridActions.Seen )  //verificar si no han finalizado los intentos
    {
      localStorage.setItem("collaborator_name", actionEvent.data.collaborator_name);
   
      localStorage.setItem("admin","");
      this.router.navigate(['personal360/' + actionEvent.data.evaluation_id + "/" + actionEvent.data.user_id]);
      
    }
    if (actionEvent.action == GridActions.Start )  //verificar si no han finalizado los intentos
    {
    //  this.plans=true;
      let data = {
        user_id: Number(localStorage.getItem("user_id")),
        collaborators_id: [],
        evaluations_id: []
      };
      this.getPlans(data);
    }

}
protected onActionEventPlans(actionEvent: { action: string, data: any }) {
  if (actionEvent.action == GridActions.Seen )  //verificar si no han finalizado los intentos
  {
    this.router.navigate(['/plan-accion/'+actionEvent.data.id]);
    
  }
 

}
    getTable()
  {
    this.isLoading=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      process_id:[7,10,11],
      collaborators_id: [],
      evaluations_id: []
    };
    this.evaluations360.getPersonalIndex360(data)
    .then((response:any) => {
      this.ListColaborator=response.users;
      this.get360(data);
      this.isLoading=false;
      this.dataSource = new MatTableDataSource(this.ListColaborator);
  
    })
    .catch((error:any) => {
      console.error('Error in the request:', error);
      this.message.error(error.message+" "+error.code);
      // Handle errors here
    });
    }
  
    getUser() {
      var user=localStorage.getItem("email");
      if(user=="")
      {
        this.router.navigate(['/login']);
        this.message.error("Tienes que iniciar sesion");
  
      }
  
      return user;
    }

    filterData(event: any) {
      this.dataSource=new MatTableDataSource(this.ListColaborator);
      switch(event)
      {
        case 'Todas':
          this.dataSource.filter ='';
          break;
        case 'Mis evaluaciones':
          this.dataSource.filter ='';
          // Filtrar los datos para mostrar solo las evaluaciones del usuario actual
          this.dataSource = new MatTableDataSource(this.ListColaborator.filter((item: any) => item.responsable_id === localStorage.getItem("user_id")));
          break;
        default:
        this.dataSource.filter =event;
      }
    
    }
  sendPageEvaluation(process:string,id:string,status:string,calificacion:number,detalle:any)
  {   
     localStorage.setItem("score", detalle[0].total_score==null?"0":detalle[0].total_score.toString());
    switch(process)
    {
      case "Evaluación 360 lider":
        //  this.router.navigate(['exam/asesors/'+id+"/1"]);
          if(status=="Terminado")
          {
            this.router.navigate(['/prueba360/'+id]);
          }
          else{
            this.router.navigate(['evaluation360/'+id]);
          }
        break
        case "Evaluación 360 Colaborador":
          //  this.router.navigate(['exam/asesors/'+id+"/1"]);
            if(status=="Terminado")
            {
              this.router.navigate(['/prueba360/'+id]);
            }
            else{
              this.router.navigate(['evaluation360/'+id]);
            }
          break
        case "Feedback y Plan de Acción":
 
          if(detalle[0].status=="Terminado")
          this.router.navigate(['/plan-accion/'+id]);
        else
        this.message.error("No has terminado  la evaluacion.")
        
      break
    }
  
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  changeProcessFunc(process:number,user_test_id:number)
  {
  
       this.changeProcess=
       {
        user_id: Number(localStorage.getItem("user_id")),
        user_test_id: user_test_id,
        process_id:process,   
       }
       this.userTestService.SendChangeProcess(this.changeProcess)
       .then((response: any) => {
      
        this.message.error("Hace falta contestar una evaluación o este proceso ya esta terminado");
      })
    
  }
    enviarFormulario(form: NgForm){
      this.onSwitchChange() 
    }
    onSwitchChange() {
      // Acciones a realizar cuando cambia el estado del switch
      this.isChecked=!this.isChecked;
     
      this.changeList();
    }
}
