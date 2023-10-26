import { EmailRequest } from 'src/app/shared/entities/models/email-request';

import {  OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ColaboradorEvaluationService } from '../../services/ColaboradorEvaluationService';
import { CollaboratorEvaluation } from 'src/app/models/ColaboradorEvaluation/ColaboradorEvaluation';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TestService} from "../../services/TestService";
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingComponent } from '../loading/loading.component';

import { TestModel } from 'src/app/models/ColaboradorEvaluation/EvaluationDetail';
@Component({
  selector: 'app-Tables',
  templateUrl: './Tables.component.html',
  styleUrls: ['./Tables.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TablesComponent implements OnInit {
  title = 'angularmaterial';
  user:any;
  isLoading:boolean=false;
  color:string="red";
  ListPersonal:CollaboratorEvaluation[];
  ListTest:TestModel[];
  mappedList: EvaluationTable[];
  //Columns names, table data from datasource, pagination and sorting
  columnsToDisplay: string[] = ['Evaluacion', 'Estatus', 'Avance', 'Colaborador'];
  obj: EvaluationTable;
  objDetail: Details;
  ListDetail: Details[];
   ELEMENT_DATA: EvaluationTable[] = []
  dataSource = new MatTableDataSource<EvaluationTable>([]);
  constructor(    private router: Router,    private ColabluationService: ColaboradorEvaluationService,private testService:TestService) { }

  expandedElement: EvaluationTable | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  getTest(data:any)
{ 
  this.user=localStorage.getItem("user_id");
  //this.testService.GetTest(data,this.user)
  //.then((response:any) => {
  //  this.ListTest=response;
  //  console.log('Response from the request:', this.ListTest);
    // You should handle the response data here.
    this.getTable(data);
  //})
 // .catch((error:any) => {
//    console.error('Error in the request:', error);
    // Handle errors here
 // });
}
getTestUser(data:any,userid:any,element: CollaboratorEvaluation)
{
  this.testService.GetTest(data,userid)
  .then((response:any) => {
    console.log(response)
    this.ListTest=response;
    console.log(this.ListTest)
    const listDetail: Details[] = this.ListTest.map((detail: TestModel) => {
      return {
        Evaluacion: detail.name,
        Etapa: "",
        Calificacion: Number(detail.total_score),
        Clasificacion: detail.rank,
        Estatus: detail.status,
        Avance: 0,
        Activo: true,
        id:element.user_evaluation_id,
        idTest:detail.id
      };
    });
   
    this.obj = {
      Evaluacion: "Evaluacion trinitas 2023",
      Estatus: element.status,
      Avance: element.actual_process,
      Colaborador: element.collaborator_name,
      Detail: listDetail,
      id:element.user_evaluation_id,
    };

    this.ELEMENT_DATA.push(this.obj);
     console.log(this.ELEMENT_DATA);
     this.dataSource = new MatTableDataSource<EvaluationTable>(this.ELEMENT_DATA);

  }).catch((error:any) => {
    console.error('Error in the request:', error);
  });
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


transformList(data:any) {
  //Transforma la lista de datos recibidos a los que estan en la tabla

  this.ListPersonal.forEach((element: CollaboratorEvaluation) => {
   this.getTestUser(data,element.user_evaluation_id,element);
  

  });

  console.log(this.ELEMENT_DATA);
}


getTable(data:any)
{
  this.ColabluationService.GetColaboradorEvaluationsWithParams(data)
  .then((response:any) => {

    this.ListPersonal=response;
    console.log(response);
    if(this.ListPersonal.length===0)
    {
        const detail:Details[]=[{
          Evaluacion: "",
          Etapa: "",
          Calificacion: 0,
          Clasificacion: "",
          Estatus: "No hay resgistros existentes",
          Avance: 0,
          Activo: true,
          idTest:0
        }]
        this.obj = {
          Evaluacion: "",
          Estatus: "No hay resgistros existentes",
          Avance: "",
          Colaborador: "",
          Detail: detail,
          id:""
        };
    
        this.ELEMENT_DATA.push(this.obj);
    }
    this.transformList(data);

   // this.dataSource = new MatTableDataSource(this.ListPersonal);
    console.log('Response from the request:', this.ListPersonal);

   
  })
  .catch((error:any) => {
    console.error('Error in the request:', error);
    // Handle errors here
  });
}
sendPageEvaluation(process:string,id:string,status:string)
{
  console.log(process)
  switch(process)
  {
    case "Evaluación de Desempeño":
      this.router.navigate(['/desempeño/'+id]);
      if(status=="Terminado")
      {
        this.router.navigate(['/desempeño/'+id]);
      }
      else{
        this.router.navigate(['/desempeño/'+id]);
      }
    break
    case "Plan de Acción":
      this.router.navigate(['/plan-accion/'+id]);
    break
    case "Evaluación de Aptitudes":
      if(status=="Terminado")
      {
        this.router.navigate(['/competencias/'+id]);
      }
      else{
        this.router.navigate(['/competencias/'+id]);
      }
    break
    case "Evaluación de Competencias":
      if(status=="Terminado")
      {
        this.router.navigate(['/competencias/'+id]);
      }
      else{
        this.router.navigate(['/competencias/'+id]);
      }
    break
  }

  
}
  ngOnInit() {
    this.isLoading=true;
    this.ELEMENT_DATA=[]; //Limpiar los datos antes de entrar
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      collaborators_id: [],
      evaluations_id: []
    };
 
  this.getTest(data);
  this.isLoading=false;

 
}
}
export interface EvaluationTable {
  Evaluacion: string;
  Estatus: string;
  Avance: string;
  Colaborador: string;
  Detail: Details[] ;
  id:string;
}
export interface Details {
  Evaluacion: string;
  Etapa: string;
  Clasificacion: string;
  Estatus: string;
  Calificacion?:number|null;
  Avance:number
  Activo:boolean;
  idTest:number;

}



  

