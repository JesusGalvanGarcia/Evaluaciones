import { Component, OnInit,Output  } from '@angular/core';
import { Injectable, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../app/loading/loading.component';
import { PLDUserService } from '@services/PLD/pldUser.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { MensajeService } from '@http/mensaje.service';

@Component({
  selector: 'app-exams',
  standalone:true,
  imports: [CommonModule,LoadingComponent,GridModule,MatTableModule,MatInputModule,MatIconModule ],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  @Output() modal: EventEmitter<any> = new EventEmitter();  //Salida de evento para cerrar modal
  test:Evaluation[];
  max:number;
  aprroved:number;
  Notaprroved:number;
  searchTerm: string = '';

  isLoading: boolean = true;
  public seeDetailSeenButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Seen,
          title:'Ver exámen',
          icon: 'fa-solid fa-eye',
          
        }
      };
      return component;
      },
 
    },
    GridActions.DEFAULT_COLUMN
  )
  protected columnDefs: ColDef[] = [
    { headerName: 'Nombre', flex:1, field: 'collaborator_name', minWidth: 200},
    { headerName: 'Finalizacion', field: 'finish_date', 
    cellRenderer: (params:any) => {
      // Evaluar el valor de la columna 'finish_date'
      if (params.value === null) {
        // Si es 'pendiente', retornar 'En proceso'
        return 'En proceso';
      } else {
        // De lo contrario, retornar la fecha
        return params.value;
      }
    }, 
       cellStyle: (params) => {
      // Evaluar el valor de la columna 'status'
      if (params.value === null) {
        // Si es 'pendiente', establecer el fondo en rojo
        return { color: 'red' };
      } else {
        // De lo contrario, no aplicar ningún estilo específico
       
          // Si es 'pendiente', establecer el fondo en rojo
          return { color: 'green' };
      }
    
    }
    } ,
    { headerName: 'Calificación Actual', field: 'total_score',  },

    this.seeDetailSeenButton
  
  ]
  constructor(public pld:PLDUserService,  private router: Router,public message:MensajeService) { }

  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      test_id:Number(localStorage.getItem("test_id")),
 
    };
    this.getDetail(data);
  }

  getNumber(data:string)
  {
    return Number(data);
  }
  closeTheModal() {
    // Perform any other logic you need before closing the modal
    this.modal.emit();
  }
  goTest(id:any)
  {
    this.closeTheModal();
    this.router.navigate(['review/'+id]);
  }
  protected onActionEvent(actionEvent: { action: string, data: Evaluation }) {
     if(actionEvent.data.finish_date==null)
     {
      this.message.error("No puedes ver el examen si  no  ha terminado.");

     }else{
      this.closeTheModal();
      this.router.navigate(['review/'+actionEvent.data.user_test_id]);
     }
  }
  
   getDetail(data:any)
   {
    this.pld.GetListExams(data)
    .then((data) => {
 //Obtener detalles
     this.test=data.test;
     let maxValue = this.test.reduce((max, item) => Math.max(max, Number(item.total_score)), -Infinity);
     this.max=maxValue;
     const filteredTests = this.test.filter(item => Number(item.total_score) >= this.test[0].min_score);
     const filteredTests2 = this.test.filter(item => Number(item.total_score) < this.test[0].min_score);

     this.aprroved=filteredTests.length;
     this.Notaprroved=filteredTests2.length;
     this.isLoading=false;
    })
    .catch((error: any) => {
      console.error('Error in the request:', error);
    
      // Handle errors here
    });
   }
}
export interface Evaluation {
  user_evaluation_id: string;
  evaluation_id: string;
  collaborator_id: string;
  collaborator_name: string;
  evaluation_name: string;
  test_name: string;
  start_date: string;
  end_date: string;
  finish_date: string;
  status: string;
  user_test_id: string;
  total_score: string;
  attempts: string;
  max_attempts: number;
  min_score: number;
  detalle: boolean;
}