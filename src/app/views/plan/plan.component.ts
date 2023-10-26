import { ActionPlanService } from './../../services/ActionPlanService';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MensajeService } from '@http/mensaje.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionPlan } from 'src/app/models/AccionPlan/ActionPlan';
import { ActionPlanParameter } from 'src/app/models/AccionPlan/ActionPlanParameters';
import { ActionPlanParameterValue,SaveAccionPlan } from 'src/app/models/AccionPlan/ActionPlanParameters';
import { MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})

export class PlanComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<User>;
  actionPlan: ActionPlan;
  savePlan:SaveAccionPlan;
  saves: ActionPlanParameter[] = [];
  values:ActionPlanParameterValue[]=[];
  dataSource = new MatTableDataSource<ActionPlanParameter>();
  valid: any = {};
  rowCount: number = 0;
  page: boolean = false;

  constructor(public actionPlanService:ActionPlanService,public dialog: MatDialog, public messageService: MensajeService,private route: ActivatedRoute) 
  {
    this.route.params.subscribe(params => {
      var param= params['firm']; //recibe los parametros 
      if (param !=undefined)
       this.page=true;  
       console.log(param,this.page)
    });
  }
  
  abrirDialogo() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '50%',
      height:'20%',
      panelClass: 'custom-dialog-container', // Add a custom CSS class

      data: { dialogText: '¿Deseas firmar este plan de acción?.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado');
    });
  }
isValidDateFormat(dateString: string,user :ActionPlanParameter): boolean {
  // Expresión regular para validar el formato dd/mm/yyyy
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  
  return datePattern.test(dateString);
}
  addRow() {
    const newRow: User = {
      id: 0,
      Area: '',
      Objetivo: '',
      Habilidad: '',
      Accion:'',
      fecha: '',
      isEdit: true,
      isSelected: false,
    }
    //Validar formulario
    if (!this.areFieldsEmpty(this.dataSource.data[this.rowCount-1],this.rowCount-1)) {
     // Incrementar el conteo y agregar los datos al dataSource
    this.rowCount++;
    newRow.id=this.rowCount;
   // this.dataSource.data = [newRow, ...this.dataSource.data]
    //Ordenar en base al numero  de  linea
    this.sortDataById(); 
  }
  else
  {
    this.messageService.error('Algun campo de texto se encuentra vacio.');
  }
  }
  addRowAction(data:ActionPlanParameter) {
    const filteredValues = this.values.filter((item) => item.parameter_id === data.id);
    const newRow: ActionPlanParameterValue = {
      id: this.rowCount,
      parameter_id: data.id,
      description: '',
      line: filteredValues.length + 1, // Incrementa el número de línea
    };
    this.rowCount++;
    this.values.push(newRow); // Agrega el nuevo campo al array 'values'
    // Incrementa el contador de línea
  }
  inputHandler(e: any, id: number, key: string) {
    const elemento = this.values.find((item) => item.id === id);
    console.log( elemento )
    if (elemento) {
      elemento.description = e.target.value; // Actualiza la propiedad en el elemento del arreglo
    }

    console.log( elemento )
  }

 



  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false)
    }
    return false
  }
  areFieldsEmpty(element: ActionPlanParameter, indice: number): boolean {
    console.log(indice);
    
    // Verifica si el índice no es -1 y si alguno de los campos en el elemento es vacío
    if (indice !== -1) {
      return Object.values(element).some((value) => value === '');
    } else {
      return false;
    }
  }
  deleteRow(item: ActionPlanParameterValue) {
    const index = this.values.indexOf(item);
    if (index !== -1) {
      this.values.splice(index, 1); // Elimina el elemento del array 'values'
    }
  }
  addLine()
  {
    for(let e of this.actionPlan.parameters)
    {
      this.addRowAction(e);
    
    }
  }
  getActionPlan(data: any) {
    this.actionPlanService.GetAction(data, 59)
      .then((response: any) => {
        this.actionPlan = response;
        this.addLine();
        this.saves=response.parameters;
        console.log(this.actionPlan)
    
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        // Handle errors here
      });
  }
  save()
  {
    //this.saves= this.dataSource.data;
    console.log(this.values)
    this.savePlan={
      user_id: 67,
      user_action_plan_id: 59,
      save_type: 1,
      agreements:this.values
    };
    console.log(this.savePlan);
    this.abrirDialogo();
  }
  isAllSelected() {
    return this.dataSource.data.every((item) => item.description)
  }

  isAnySelected() {
    return this.dataSource.data.some((item) => item.description)
  }

  selectAll(event: any) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }))
  }
  sortDataById() {
    this.dataSource.data.sort((a, b) => a.id - b.id);
    this.table.renderRows(); // Para refrescar la vista de la tabla
  }
  ngOnInit() {
    let data = {
      user_id: 67,
    };
    this.getActionPlan(data);
    if (this.page == false) {
   //   this.addRow();
    }
  
    // Agrega una comprobación para verificar si actionPlan es undefined
    
  }

}
