import { Component, OnInit } from '@angular/core';
import { UserEvaluationService } from '../../shared/services/userEvaluation.service';
import { Chart, ChartType } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import{Evaluation360Service} from '../../shared/services/evaluation360.service';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../loading/loading.component';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
// Resto de tu código
import { MensajeService } from '@http/mensaje.service';

@Component({
  selector: 'app-personal360',
  standalone: true,
  templateUrl: './personal360.component.html',
  styleUrls: ['./personal360.component.css'],
  imports:[CommonModule,MatCardModule,  LoadingComponent]
})
export class Personal360Component implements OnInit {
  body: any;
  promedioData: any;
  evaluatorData: any;
  generalData: any;
  tableLabels: any;
  tableData: any;
  isLoading:boolean=true;
  user_id:number;
  name:any;
  rol:any;
  lideres:any;
  lateral:any;
  question_averages:any;
  colaboradores:any;
  autoevaluacion:any;
  cliente:any;
  evaluation_id:number;
  // Atributo que almacena los datos del chart
  public chart: Chart;
  response:any;
  ngOnInit(): void {
    this.name=localStorage.getItem("collaborator_name");
    this.rol=localStorage.getItem("admin");
    this.getData();
  }

  constructor(public message:MensajeService,public evaluation360:Evaluation360Service,public evaluationService: UserEvaluationService, public router:Router,   private route: ActivatedRoute, 
    ) {
    this.route.params.subscribe(params => {
      this.user_id = params['idUser']; 
      this.evaluation_id = params['idEvaluation']; 
    });

  }
  postApproved()
  {
    this.isLoading=true;
    let data = {
      user_id:  this.user_id,
      evaluation_id:this.evaluation_id
    };
    this.evaluation360.changeStatus(data)
    .then((response: any) => {
     this.message.success("El  reporte se ha aprobado con exito");
     this.back();
    })
    .catch((error: any) => {
      console.error('Error in the request:', error);
      this.isLoading=false;
      this.message.error("Hubo un error al aprobar el reporte"+error);

      // Handle errors here
    });
  }
  back()
  { 
    localStorage.setItem("page_evaluation",  this.evaluation_id.toString());
    if( this.rol=localStorage.getItem("admin")!="")
   {
     this.router.navigate(['/dashboard/admin360']);
     localStorage.setItem("admin", "");
   }
    else
    this.router.navigate(['/dashboard/evaluacion360']);

  }
  numbers(num:any)
  {
    return num.toFixed(2);
  }
  sum(labels: any): number {
    // Calculate the sum of values in the labels array
    return labels.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
  }
  
  average(aspect: any, question: any): any {
    let labels = Object.values(this.question_averages[aspect][question]);

    return (this.sum(labels)/labels.length).toFixed(2);
    
  }
  
  async getData() {
    this.body = {
      user_id: this.user_id,
      evaluation_id: this.evaluation_id
    };

    try {
      const response = await this.evaluationService.GetAverages(this.body);
      console.log(response);
      this.promedioData = response.promedio;
      this.evaluatorData = response.evaluator;
      this.generalData = response.general;
      this.lideres=response.Lideres;
      this.colaboradores=response.Colaboradores;
      this.autoevaluacion=response.Autoevaluacion;
      this.lateral=response.Lateral;
      this.cliente=response.Cliente;
      this.question_averages=response.question_averages;
      this.response=response;
      this.tableLabels = Object.keys(response.general);
      this.tableData= Object.values(response.general);
      this.processData(this.promedioData ,'radar','chart','Promedio por modulo');
      this.processData(this.evaluatorData ,'bar','evaluators','Promedio  por evaluador');
      this.processData(this.promedioData ,'bar','promedio','Promedio general');
      this.isLoading=false;
    } catch (error) {
      console.log(error);

    }
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  private processData(datas: any, name: any, grafic: any, title: any): void {
    const labels: string[] = Object.keys(datas);
    const values: number[] = Object.values(datas);
  
    // Define un array de colores para cada barra
    const backgroundColors: string[] = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 0, 0, 0.2)',
      'rgba(0, 255, 0, 0.2)',
      'rgba(0, 0, 255, 0.2)',
      'rgba(128, 128, 0, 0.2)',
      'rgba(0, 128, 128, 0.2)',
      'rgba(128, 0, 128, 0.2)',
      'rgba(255, 140, 0, 0.2)',
      'rgba(0, 255, 255, 0.2)',
      'rgba(255, 0, 255, 0.2)',
    ];
   const colors=this.shuffleArray(backgroundColors);
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.2', '1')), // Bordes con opacidad completa
          borderWidth: 1
        }
      ]
    };
  
    this.chart = new Chart(grafic, {
      type: name as ChartType,
      data: data,
      options: {
        indexAxis: 'y',
        scales: {
          r: {
            beginAtZero: true
          },
        },
      },
    });
  }
  
  onSelect(event: any): void {
    console.log(event);
  }
   shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
  
    // Mientras queden elementos a mezclar
    while (currentIndex !== 0) {
  
      // Selecciona un elemento sin mezclar
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // Intercambia el elemento seleccionado con el actual
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  convertToPDF(): void {
    this.isLoading=true;
    const elementId1 = 'contentToConvert';
    const elementId2 = 'contentToConvert2';
  
    const pdf = new jspdf('p', 'mm', 'a4');
  
    const addNewPage = () => {
      pdf.addPage();
    };
  
    const convertElementToPDF = async (elementId: string) => {
      const dataElement = document.getElementById(elementId);
  
      if (dataElement) {
        const canvas = await html2canvas(dataElement);
  
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        const contentDataURL = canvas.toDataURL('image/png');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
     
      } else {
        console.error(`No se encontró el elemento con el ID "${elementId}".`);
      }
    };
    const convertElementToPDFTable = async (elementId: string) => {
      const dataElement = document.getElementById(elementId);
  
      if (dataElement) {
        const canvas = await html2canvas(dataElement);
        const imgWidth = 210;
        const imgHeight = 295; // A4 size in mm
  
        const contentDataURL = canvas.toDataURL('image/png');
  
        // Split the content into multiple parts
        const totalHeight = canvas.height;
        let currentPosition = 0;
        let leftHeight = totalHeight;
  
  
          const partHeight = Math.min(leftHeight, imgHeight);
          pdf.addImage(contentDataURL, 'PNG', 0, currentPosition, imgWidth, partHeight);
  
          leftHeight -= partHeight;
          currentPosition += partHeight;
        
      } else {
        console.error(`No se encontró el elemento con el ID "${elementId}".`);
      }
    };
  
    const convertAllElements = async () => {
      await convertElementToPDF(elementId1);
      addNewPage();
      await convertElementToPDFTable("converttable");
      addNewPage();
      await convertElementToPDF("graficas");
      addNewPage();
      await convertElementToPDF("contentToConvert2");
      addNewPage();
      await convertElementToPDF("adicional");

      // Puedes agregar más llamadas a convertElementToPDF para otros elementos
  
      pdf.save('Reporte-360.pdf');
      this.isLoading=false;
    };
  
    convertAllElements();
  }
  
}
