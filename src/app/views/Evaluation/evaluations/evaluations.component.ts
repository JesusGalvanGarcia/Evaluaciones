import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { AgGridModule } from 'ag-grid-angular';
import { CollaboratorEvaluation } from '@models/colaboradorEvaluation/colaboradorEvaluation';
import { TestModel } from '@models/colaboradorEvaluation/evaluationDetail';
import { ProcessModel } from "../../../shared/entities/models/testDetails/processModel";
import { UserEvaluationService } from "../../../shared/services/Evaluations/Desempeño/userEvaluation.service";
import { LoadingComponent } from '../../app/loading/loading.component';
import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-evaluations',
  
  standalone:true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule, 
    LoadingComponent,
    MatTabsModule,
    FormsModule,
    CdkTableModule,
    AgGridModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class EvaluationsComponent implements OnInit {
protected  isChecked: boolean = true;
changeProcess:ProcessModel;
ListChangeColaborator:CollaboratorEvaluation[];
ListColaborator:CollaboratorEvaluation[];
ListTest:TestModel[];
mostrar:boolean=false;
indexPos:number;
PersonalList:CollaboratorEvaluation[];
protected isLoading: boolean = false;
options: string[] = ['Pendiente', 'Proceso', 'Terminado', 'Mis evaluaciones','Todas'];
selectedOptions: string[] = [];
displayedColumns: string[] = [ 'evaluation_name', 'collaborator_name', 'actual_process','start_date', 'phase', 'status',"action"];
dataSource: MatTableDataSource<TestModel> | any = [];
filteredData: MatTableDataSource<TestModel> | any = [];
originData: MatTableDataSource<TestModel> | any = [];
constructor(private http: HttpClient,
  private userEvaluationService: UserEvaluationService,
  private router: Router,    
  public message:MensajeService,
  public userTestService: UserTestService
  ) {
  
  }

getTestUser(data:any,userid:any,array:number)
{
  this.userEvaluationService.GetTest(data,userid)
  .then((response:any) => {
   
    this.mostrar=true;
    this.isLoading=false;

    this.ListColaborator[array].detail=response;
    
 
  }).catch((error:any) => {
    this.message.error(error.message+" "+error.code);

    console.error('Error in the request:', error);
  });
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




changeList(status:any)
{
  if(status=='Colaboradores')
  this.ListColaborator=this.ListChangeColaborator;
  else{
  this.ListColaborator=this.PersonalList;
  }
  this.dataSource = new MatTableDataSource(this.ListColaborator);

  
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
    this.dataSource.data.forEach((element: any) => {
      if (element !== row) {
        element.isExpanded = false;
      }
    });  
    row.isExpanded = !row.isExpanded;
    row.detail=[]
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      process_id:[1,2,3,4,5],
      collaborators_id: [],
      evaluations_id: []
    };
    const posicion = this.ListColaborator.findIndex((elemento) => elemento.user_evaluation_id
    === row.user_evaluation_id    );
    this.indexPos=posicion;
    this.getTestUser(data,row.user_evaluation_id ,posicion);
    this.dataSource.data = [...this.dataSource.data];

}

  getTable()
{
  this.isLoading=true;
  let data = {
    user_id: Number(localStorage.getItem("user_id")),
    process_id:[12,13,14,15],
    collaborators_id: [],
    evaluations_id: []
  };
  this.userEvaluationService.GetColaboradorEvaluationsWithParams(data)
  .then((response:any) => {
    this.ListColaborator=response.collaborators_evaluations    ;
    this.ListColaborator=this.ListColaborator;
    this.PersonalList=response.personal_evaluations;
    this.ListChangeColaborator=response.collaborators_evaluations;
    this.PersonalList=this.PersonalList;
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

sendPageEvaluation(process:string,id:string,status:string,process_id:number,index:number)
{   
  if(status=='Terminado')
    {
      if(process=='Feedback y Plan de Acción')
      this.router.navigate(['/plan-accion/'+id]);
      else
      this.router.navigate(['/prueba/'+id]);
    }
  else
  {
  switch(Number(process_id))
  {
    case  12  :
      if(this.ListColaborator[this.indexPos].detail[index].order=='1')
    this.router.navigate(['/competencias/'+id]);
    else 
    this.message.error("Hace falta contestar una evaluación o este proceso ya esta terminado");

    break;
    case  13  :
      if(this.ListColaborator[this.indexPos].detail[0].status=='Terminado')
        this.router.navigate(['/desempeño/'+id]);
      else
      this.message.error("Hace falta contestar una evaluación o este proceso ya esta terminado");
    break;
    default:
      if(this.ListColaborator[this.indexPos].detail[0].status=='Terminado'&&this.ListColaborator[this.indexPos].detail[1].status=='Terminado')
        this.router.navigate(['/plan-accion/'+id]);
      else
      this.message.error("Hace falta contestar una evaluación o este proceso ya esta terminado");
    break;
  }
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

onTabChange(status:any) {
    // Acciones a realizar cuando cambia el estado del switch   
    this.changeList(status.tab.textLabel);
  }
}
