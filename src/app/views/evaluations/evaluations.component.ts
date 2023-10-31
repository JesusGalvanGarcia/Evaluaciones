import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { ColaboradorEvaluationService } from '../../services/ColaboradorEvaluationService';
import { CollaboratorEvaluation } from 'src/app/models/ColaboradorEvaluation/ColaboradorEvaluation';
import {TestService} from "../../services/TestService";
import { EvaluationService } from '../../services/EvaluationService';
import { TestModel } from 'src/app/models/ColaboradorEvaluation/EvaluationDetail';
import {ProcessModel} from "../../models/TestDetails/ProcessModel";
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingComponent } from '../loading/loading.component';
import { PersonalEvaluation } from 'src/app/models/PersonalEvaluation/PersonalEvaluation';
import { MatInputModule } from '@angular/material/input';

import { PersonalEvaluationService } from '../../services/PersonalEvaluationService';

@Component({
  selector: 'app-evaluations',
  
  standalone:true,
  imports: [
    CommonModule,MatTooltipModule,MatInputModule, LoadingComponent,FormsModule,CdkTableModule,AgGridModule,MatIconModule,MatTableModule],
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
 testModelList: TestModel[] = [
  {
    id: 1,
    name: "Prueba 1",
    total_score: "90",
    finish_date: "2023-10-27",
    status: "Aprobado",
    rank: "Alto",
    type: "Evaluación de desempeño",
  },
  {
    id: 2,
    name: "Prueba 2",
    total_score: "85",
    finish_date: "2023-10-26",
    status: "En progreso",
    rank: "Medio",
    type: "Examen de certificación",
  },
  {
    id: 3,
    name: "Prueba 3",
    total_score: "70",
    finish_date: "2023-10-25",
    status: "Reprobado",
    rank: "Bajo",
    type: "Evaluación de conocimientos",
  },
];
ListColaborator:CollaboratorEvaluation[];
ListTest:TestModel[];
mostrar:boolean=false;
indexPos:number;
PersonalList:CollaboratorEvaluation[];
protected isLoading: boolean = false;

displayedColumns: string[] = [ 'evaluation_name', 'collaborator_name', 'actual_process', 'phase', 'status',"action"];
dataSource: MatTableDataSource<TestModel> | any = [];
constructor(private http: HttpClient,private personalEvaluationService: PersonalEvaluationService,private evaluationService: EvaluationService,  private router: Router,    private ColabluationService: ColaboradorEvaluationService,private testService:TestService,public message:MensajeService) {}

getTestUser(data:any,userid:any,array:number)
{
  this.testService.GetTest(data,userid)
  .then((response:any) => {
    console.log(response)
    this.mostrar=true;
    this.isLoading=false;

    this.ListColaborator[array].detail=response;
    console.log(this.ListColaborator);
 
  }).catch((error:any) => {
    console.error('Error in the request:', error);
  });
}

changeList()
{
  if(this.isChecked==true)
  this.ListColaborator=this.ListChangeColaborator;
  else{
  this.ListColaborator=this.PersonalList;
  }
  this.dataSource = new MatTableDataSource(this.ListColaborator);

  console.log(this.ListColaborator);
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

  getTable()
{
  this.isLoading=true;
  let data = {
    user_id: Number(localStorage.getItem("user_id")),
    collaborators_id: [],
    evaluations_id: []
  };
  this.ColabluationService.GetColaboradorEvaluationsWithParams(data)
  .then((response:any) => {
    this.ListColaborator=response.collaborators_evaluations;
    this.PersonalList=response.personal_evaluations;
    this.ListChangeColaborator=response.collaborators_evaluations;
    this.isLoading=false;
    console.log(this.ListColaborator)
    this.dataSource = new MatTableDataSource(this.ListColaborator);

  })
  .catch((error:any) => {
    console.error('Error in the request:', error);
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
  clasification(data:string)
{
  switch(data)
  {
    case "Sin clasificación":
      return "Esta evaluacion no se terminado de contestar aún ."
    case "En Riesgo":
      return "El colaborador ha tenido un rendimiento significativamente por debajo de las expectativas, tiene áreas de mejoras claramente identificadas, mismas que se le han indicado por medio de retroalimentación, necesidad urgente de intervención y desarrollo."
    case "Baja":
      return "El colaborador tuvo un desempeño insatisfactorio en varias áreas clave, así como el incumplimiento en sus metas y objetivos, requiere acciones correctivas para evitar consecuencias negativas."
    case "Regular":
      return "El colaborador ha tenido un cumplimiento básico de responsabilidades y expectativas, muestra competencias en algunas áreas pero con espacio para mejora. Cumple con las expectativas mínimas pero hay oportunidades para el crecimiento."
    case "Buena":
      return "El colaborador ha tenido un rendimiento sólido y consistente, cumple y en algunos casos supera las expectativas en su rol. Demuestra habilidades y competencias efectivas en la mayoría de las áreas.        "
    case "Excelente":
      return "El colaborador excede consistentemente las expectativas, muestra un desempeño excepcional y contribuye de manera significativa al equipo y a los objetivos de la organización, tiene un alto sentido de compromiso."
    case "Máxima":
      return "El colaborador tiene un desempeño excepcionalmente destacado en todas las áreas. Ha hecho contribuciones significativas que impactan positivamente en el equipo y en la organización en general, el colaborador muestra competencias que refieren estar listo para ser promovido."
     default:
         return"Sin clasificacioes"
    }
 
}
getColorByClasification(clasification: string) {
  switch (clasification) {
    case "Sin clasificación":
      return "#000";
    case "En Riesgo":
      return "#A52A2A";
    case "Baja":
      return "#DC143C";
    case "Regular":
      return "#1E90FF";
    case "Buena":
      return "#DAA520";
    case "Excelente":
      return "#228B22";
    case "Máxima":
      return "#228B22";
    default:
      return "#000"; // Color por defecto si no se encuentra una clasificación válida.
  }
}

sendPageEvaluation(process:string,id:string,status:string,calificacion:number,detalle:any)
{   
   localStorage.setItem("score", calificacion.toString());

  switch(process)
  {
    case "Evaluación de Desempeño":
      this.router.navigate(['/desempeño/'+id]);
      if(status=="Terminado")
      {
        this.router.navigate(['/prueba/'+id]);
      }
      else{
        this.router.navigate(['/desempeño/'+id]);
      }
    break
    case "Feedback y Plan de Acción":
 
      const elemento = detalle.find((item:any) => item.name === "Evaluación de Competencias");
      console.log(elemento)
      if(elemento.status!="Terminado")
      {
        this.message.error("La evaluación de competencias no se ha terminado de contestar.");
      }
      else
      {
        this.router.navigate(['/plan-accion/'+id]);
      }
    break
    case "Evaluación de Competencias":
      if(status=="Terminado")
      {
        this.router.navigate(['/prueba/'+id]);
      }
      else{
        const elemento = detalle.find((item:any) => item.name === "Evaluación de Desempeño");
        console.log(elemento)
        if(elemento.status!="Terminado")     
          this.message.error("La evaluación de desempeño no se ha terminado de contestar.");  
        else
          this.router.navigate(['/competencias/'+id]);
        

      }
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
     this.evaluationService.SendChangeProcess(this.changeProcess)
     .then((response: any) => {
      console.log(response);
      this.message.error("Hace falta contestar una evaluación o este proceso ya esta terminado");
    })
  
}
  enviarFormulario(form: NgForm){
    this.onSwitchChange() 
  }
  onSwitchChange() {
    // Acciones a realizar cuando cambia el estado del switch
    this.isChecked=!this.isChecked;
    console.log(this.isChecked)
    this.changeList();
  }
}
