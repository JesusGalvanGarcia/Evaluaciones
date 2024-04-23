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
import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { PLDUser } from '../../shared/entities/models/pldUser/pldUser';
import { PLDUserService } from '@services/PLD/pldUser.service';
import { AttemptsComponent } from './attempts/attempts.component';

@Component({
  selector: 'app-PLD',
  standalone:true,
  templateUrl: './PLD.component.html',
  styleUrls: ['./PLD.component.scss'],
  imports: [MatMenuModule,CommonModule,MatIconModule,MatCardModule,GridModule,MatBadgeModule,MatDialogModule]
})
export class PLDComponent implements OnInit {
  PLDData: PLDUser;
  isLoading: boolean = true;
  start:boolean=false;

  ​
  // Custom Button
  public seeDetailButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Start,
          icon:'fa-solid fa-arrow-right',
          title:'Empezar exámen'
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
          action:  GridActions.Seen,
          title:'Ver exámen',
          icon: 'fa-solid fa-eye'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  protected columnDefs: ColDef[] = [
    { headerName: 'Examen', flex:1, field: 'test_name', minWidth: 200},
    { headerName: 'Nombre', field: 'collaborator_name',  },
    { headerName: 'Estatus', field: 'status',     cellStyle: (params) => {
      // Evaluar el valor de la columna 'status'
      if (params.value === 'Pendiente') {
        // Si es 'pendiente', establecer el fondo en rojo
        return { color: 'red' };
      } else {
        // De lo contrario, no aplicar ningún estilo específico
        if (params.value === 'Terminado') {
          // Si es 'pendiente', establecer el fondo en rojo
          return { color: 'green' };
      }
      else
      {
        if (params.value === 'Proceso') {
          
          return { color: 'blue' };
      }
      else
      {
        return null;
      }
    }
    }} },
    { headerName: 'Calificación Actual', field: 'total_score',  },
    { headerName: 'Inicio', field: 'start_date',  },
    { headerName: 'Fin', field: 'end_date',},
    { headerName: 'Intento', field: 'attempts',},
    this.seeDetailButton,
    this.seeDetailSeenButton
  
  ]
​
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public router:Router,
    private PLDService:  PLDUserService,
    public message: MensajeService) { }
  startModal = true; // o false, dependiendo de tu lógica
  modalOpen = false;
  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();
  close() {
    this.closeModalEvent.emit();
  }
  openModal() {
  
    const isMobile = this.breakpointObserver.isMatched('(max-width: 600px)'); // Define  límite de ancho para dispositivos móviles

    const dialogRef = this.dialog.open(AttemptsComponent, {
      width: isMobile ? '90%' : '50%', // Ventana del modal
      height: isMobile ? '80%' : '60%', // 
      disableClose: false,
      hasBackdrop: true
    });
    
    dialogRef.afterClosed().subscribe(result => {
    
    });
    this.closeModalEvent.subscribe(() => {
      dialogRef.close();
    });
  }
  
  closeModal() {
 this.dialog.closeAll()
  }
  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    this.getExamns(data);
  }
  getExamns(data: any) {
 
  
    this.PLDService.GetExamns(data)  //Cargar examen
      .then((response: any) => {
       
        this.PLDData = response.test;
       

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar los examenes "+error);
        // Handle errors here
      });
  }
  protected onActionEvent(actionEvent: { action: string, data: PLDUser }) {
    const today = new Date();
  
    if (actionEvent.action == GridActions.Start && actionEvent.data.finish_date == null) { //verificar si no han finalizado los intentos
      const startDate = new Date(actionEvent.data.start_date);
      const endDate = new Date(actionEvent.data.end_date);
  
      // Verificar si la fecha actual está entre start_date y end_date
      if (today >= startDate && today <= endDate) {
        this.router.navigate(['exams/' + actionEvent.data.user_test_id + "/" + actionEvent.data.attempts]);
      } else {
        this.message.error("La fecha actual no está dentro del rango permitido para comenzar el examen.");
      }
    } else {
      if (actionEvent.action == GridActions.Seen) {
        this.openModal(); // abrir modal para ver el detalle
        localStorage.setItem("evaluation_id", actionEvent.data.user_evaluation_id);
      } else {
        this.message.error("Ya no te quedan intentos disponibles o el examen ya fue aprobado.");
      }
    }
  }
  
}
