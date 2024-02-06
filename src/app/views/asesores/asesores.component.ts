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
import { ProcessModel } from "../../shared/entities/models/testDetails/processModel";
import { UserEvaluationService } from "../../shared/services/userEvaluation.service";
import { LoadingComponent } from '../loading/loading.component';
import { UserTestService } from '@services/userTest.service';
@Component({
  selector: 'app-asesores',
  templateUrl: './asesores.component.html',
  styleUrls: ['./asesores.component.css'],
  standalone:true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule, 
    LoadingComponent,
    FormsModule,
    CdkTableModule,
    AgGridModule,
    MatIconModule,
    MatTableModule
  ],
})
export class AsesoresComponent implements OnInit {

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
  
  displayedColumns: string[] = [ 'evaluation_name', 'collaborator_name', 'actual_process','start_date', 'phase', 'status',"action"];
  dataSource: MatTableDataSource<TestModel> | any = [];
  constructor(private http: HttpClient,
    private userEvaluationService: UserEvaluationService,
    private router: Router,    
    public message:MensajeService,
    public userTestService: UserTestService
    ) {}
  
  getTestUser(data:any,userid:any,array:number)
  {
    this.userEvaluationService.GetTest(data,userid)
    .then((response:any) => {
     
      this.mostrar=true;
      this.isLoading=false;
  
      this.ListColaborator[array].detail=response;
      
   
    }).catch((error:any) => {
      console.error('Error in the request:', error);
    });
  }
  
  changeList()
  {
    if(this.isChecked==true)
    this.ListColaborator=this.ListChangeColaborator.filter(colaborator => colaborator.process_id === "6"||Number(colaborator.process_id) ===8||Number(colaborator.process_id) ===9);
    else{
    this.ListColaborator=this.PersonalList.filter(colaborator => colaborator.process_id === "6"||Number(colaborator.process_id) ===8||Number(colaborator.process_id) ===9);
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
    this.userEvaluationService.GetColaboradorEvaluationsWithParams(data)
    .then((response:any) => {
      this.ListColaborator=response.collaborators_evaluations;
      this.ListColaborator = this.ListColaborator.filter(colaborator => colaborator.process_id === "6"||Number(colaborator.process_id) ===8||Number(colaborator.process_id) ===9);

      this.PersonalList=response.personal_evaluations;
      this.PersonalList = this.PersonalList.filter(colaborator => colaborator.process_id === "6"||Number(colaborator.process_id) ===8||Number(colaborator.process_id) ===9);

      this.ListChangeColaborator=response.collaborators_evaluations;
      this.isLoading=false;
     console.log(response);
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
           return"Sin clasificacion"
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
     localStorage.setItem("score", detalle[0].total_score.toString());
  
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
      case "Evaluaciones de asesores":
      //  this.router.navigate(['exam/asesors/'+id+"/1"]);
        if(status=="Terminado")
        {
          this.router.navigate(['/prueba/'+id]);
        }
        else{
          this.router.navigate(['/dashboard/exam/asesors/'+id+"/1"]);
        }
      break
      case "Evaluaciones 360":
        //  this.router.navigate(['exam/asesors/'+id+"/1"]);
          if(status=="Terminado")
          {
            this.router.navigate(['/prueba/'+id]);
          }
          else{
            this.router.navigate(['/dashboard/exam/evaluation350/'+id]);
          }
        break
      case "Feedback y Plan de Acción":
   
        const elemento = detalle.find((item:any) => item.name === "Evaluaciones de asesores");
      
        if(elemento.status!="Terminado")
        {
          this.message.error("La evaluación  no se ha terminado de contestar.");
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
