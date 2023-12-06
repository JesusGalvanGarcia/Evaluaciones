import { GridModule } from '@sharedComponents/grid/grid.module';
import { Router } from '@angular/router';
import { Component, OnInit,Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { TestPldGridDTO } from '@dtos/catalog/test-pld-grid-dto';
import { TestsService } from '@services/test.service';
import { GridActions } from '@utils/grid-action';
import { ConfirmationModalComponent } from '@sharedComponents/confirmation-modal/confirmation-modal.component';
import { lastValueFrom } from 'rxjs';
import { MensajeService } from '@http/mensaje.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingComponent } from '../../loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import{ExamsComponent} from '../../exams/exams.component';
import { Injectable, EventEmitter } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-adminPld',
  templateUrl: './adminPld.component.html',
  styleUrls: ['./adminPld.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ConfirmationModalComponent,
    LoadingComponent
  ],
  providers: [
    BsModalService
  ]
})
export class AdminPldComponent implements OnInit {
  protected isLoading: boolean = false;
  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  public seeDetail:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Seen,
          icon: 'fa-solid fa-eye'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  protected testsPldList: TestPldGridDTO[] = []
  protected columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 70  },
    { headerName: 'Nombre', flex:1, field: 'name', minWidth: 200},
    { headerName: 'Fecha Inicio', field: 'start_date',  },
    { headerName: 'Respuestas', field: 'amount_answers',  },
    this.seeDetail

  ]
  constructor(
    private router: Router,
    private testsService: TestsService,
    private mensajeService: MensajeService,
    private modalService: BsModalService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getGridDTO()
  }

  getGridDTO() {
    this.isLoading = true;
    this.testsService.getPldGridDTO().then((tests: TestPldGridDTO[]) => {
      this.testsPldList = tests;
      this.isLoading = false;
    })

  }

  onActionEvent(actionEvent: {action: string, data: TestPldGridDTO}){
    const test = actionEvent.data;
    const acciones: any = {
      [GridActions.EDIT]: () => this.openEditForm(test.id),
      [GridActions.ADD]: () => this.openAddForm(),
      [GridActions.Seen]: () => this.openModal(test.id),
      [GridActions.DELETE]: () => this.delete(test),
    };
    acciones[actionEvent.action]();
  }

  protected openAddForm(){
    this.router.navigate(['/dashboard/exam/adminPld/form']);
  }

  private openEditForm(idTest: number){
    this.router.navigate(['/dashboard/exam/adminPld/form/', idTest]);
  }
  close() {
    this.closeModalEvent.emit();
  }
  openModal(id:any) {
    
    const isMobile = this.breakpointObserver.isMatched('(max-width: 600px)'); // Define  límite de ancho para dispositivos móviles
    localStorage.setItem("test_id", id);

    const dialogRef = this.dialog.open(ExamsComponent, {
      width: isMobile ? '90%' : '70%', // Ventana del modal
      height: isMobile ? '90%' : '80%', // 
      disableClose: false,
      hasBackdrop: true
    });
    
    dialogRef.componentInstance.modal.subscribe(() => {
      dialogRef.close();
      this.close();
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
      this.close();
    });
    
  }
  private delete(test: TestPldGridDTO){
    const TITULO_MODAL: string = 'Eliminar examen';
    const MENSAJE_CONFIRMACION: string = '¿Estás seguro que desea eliminar el examen ' + test.name +' ?';
    const MENSAJE_EXITO: string = 'El examen ha sido desactivado';
    const modal = this.modalService.show(ConfirmationModalComponent);
    
    (<ConfirmationModalComponent>modal.content).showConfirmationModal(
      TITULO_MODAL,
      MENSAJE_CONFIRMACION
    );

    (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          this.testsService.delete(test.id).then(()=>{
            this.mensajeService.success(MENSAJE_EXITO);
            this.getGridDTO();
          })
        } else if(result === false) {
            // when pressed No
        } else {
            // When closing the modal without no or yes
        }
    });
  } 

}
