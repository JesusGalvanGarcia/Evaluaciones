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
import { ActionPlanParameterValue } from 'src/app/models/AccionPlan/ActionPlanParameters';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})

export class PlanComponent implements OnInit {
  displayedColumns: string[] = []; // Inicializa con un arreglo vacío
  @ViewChild(MatTable) table: MatTable<User>;
  actionPlan: ActionPlan;
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
    const newRow: ActionPlanParameter = {
        id:data.id,
        description:data.description,
        value_type:data.value_type,
        action_plan_id:data.action_plan_id
    }
    //Validar formulario
    if (!this.areFieldsEmpty(this.dataSource.data[this.rowCount-1],this.rowCount-1)) {
     // Incrementar el conteo y agregar los datos al dataSource
    this.rowCount++;
    newRow.id=this.rowCount;
    this.dataSource.data = [newRow, ...this.dataSource.data]
    //Ordenar en base al numero  de  linea
    this.sortDataById(); 
  }
  else
  {
    this.messageService.error('Algun campo de texto se encuentra vacio.');
  }
  }
  inputHandler(e: any, id: number, key: string) {
    const elemento = this.dataSource.data.find((item) => item.id === id);
    if (elemento) {
      elemento.value_type = e.target.value; // Actualiza la propiedad en el elemento del arreglo
    }

    console.log( elemento )
  }
  deleteRow(rowIndex: number) {
    // Verifica si el índice es válido y está dentro del rango
    if (rowIndex >= 0 && rowIndex < this.dataSource.data.length) {
      // Copia el origen de datos actual
      const data = [...this.dataSource.data];
      
      // Elimina la fila en el índice especificado
      data.splice(rowIndex, 1);
  
      // Actualiza el origen de datos para reflejar el cambio
      this.dataSource.data = data;
    }
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
  getActionPlan(data: any) {
    this.actionPlanService.GetAction(data, "59")
      .then((response: any) => {
        this.actionPlan = response;
        this.displayedColumns = response.parameters.map((param: ActionPlanParameter) => param.description);
        console.log(this.displayedColumns)
        this.values=[
          {
            id:1,
            idParameter:1,
            value:"Area de op",
            action_plan_id:1

          },
          {
            id:2,
            idParameter:2,
            value:"obj",
            action_plan_id:1

          },
          {
            id:3,
            idParameter:3,
            value:"hab",
            action_plan_id:1

          }
          ,
          {
            id:4,
            idParameter:4,
            value:"accion to",
            action_plan_id:1

          },
          {
            id:5,
            idParameter:5,
            value:"fecha",
            action_plan_id:1

          }
        ]
        console.log(this.actionPlan.parameters);
        console.log(this.values)
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        // Handle errors here
      });
  }
  save()
  {
    this.saves= this.dataSource.data;
    console.log(this.saves)
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
