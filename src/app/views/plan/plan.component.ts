import { Component, OnInit } from '@angular/core';
import { User,UserColumns } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MensajeService } from '@http/mensaje.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})

export class PlanComponent implements OnInit {
  displayedColumns: string[] = UserColumns.map((col) => col.key)
  @ViewChild(MatTable) table: MatTable<User>; // Esta es la declaración @ViewChild
  
  saves: User[];
  columnsSchema: any = UserColumns
  dataSource = new MatTableDataSource<User>()
  valid: any = {}
  rowCount: number = 0;
  page:boolean=false;
  constructor(public dialog: MatDialog, public messageService: MensajeService,private route: ActivatedRoute) 
  {
    this.route.params.subscribe(params => {
      var param= params['firm']; //recibe los parametros 
      if (param !=undefined)
       this.page=true;  
       console.log(param,this.page)
    });
  }
isValidDateFormat(dateString: string,user :User): boolean {
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
    
    if (!this.areFieldsEmpty(this.dataSource.data[this.rowCount-1],this.rowCount-1)) {
    this.rowCount++;
    newRow.id=this.rowCount;
    // Incrementar el conteo
    this.dataSource.data = [newRow, ...this.dataSource.data]
    
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
      elemento[key] = e.target.value; // Actualiza la propiedad en el elemento del arreglo
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
  areFieldsEmpty(element: User, indice: number): boolean {
    console.log(indice);
    
    // Verifica si el índice no es -1 y si alguno de los campos en el elemento es vacío
    if (indice !== -1) {
      return Object.values(element).some((value) => value === '');
    } else {
      return false;
    }
  }
  
  save()
  {
    this.saves= this.dataSource.data;
    console.log(this.saves)
  }
  isAllSelected() {
    return this.dataSource.data.every((item) => item.isSelected)
  }

  isAnySelected() {
    return this.dataSource.data.some((item) => item.isSelected)
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
    this.addRow();

// Habilita la ordenación
  }

}
