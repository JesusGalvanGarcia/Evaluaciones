import { EmailRequest } from 'src/app/shared/entities/models/email-request';

import {  OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ColaboradorEvaluationService } from '../../services/ColaboradorEvaluationService';
import { CollaboratorEvaluation } from 'src/app/models/ColaboradorEvaluation/ColaboradorEvaluation';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TestService} from "../../services/TestService";
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
  constructor(private ColabluationService: ColaboradorEvaluationService,private testService:TestService) { }

  expandedElement: EvaluationTable | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  getTest(data:any)
{ 
  this.testService.GetTest(data,"59")
  .then((response:any) => {
    this.ListTest=response;
    console.log('Response from the request:', this.ListTest);
    // You should handle the response data here.
    this.getTable(data);
  })
  .catch((error:any) => {
    console.error('Error in the request:', error);
    // Handle errors here
  });
}
transformList() {
  //Transforma la lista de datos recibidos a los que estan en la tabla
  this.ListPersonal.forEach((element: CollaboratorEvaluation) => {
    const listDetail: Details[] = this.ListTest.map((detail: TestModel) => {
      return {
        Evaluacion: detail.name,
        Etapa: "",
        Calificacion: Number(detail.total_score),
        Clasificacion: detail.rank,
        Estatus: detail.status,
        Avance: 0,
        Activo: true,
      };
    });

    this.obj = {
      Evaluacion: "Evaluacion trinitas 2023",
      Estatus: element.status,
      Avance: element.actual_process,
      Colaborador: element.collaborator_name,
      Detail: listDetail,
    };

    this.ELEMENT_DATA.push(this.obj);
  });

  console.log(this.ELEMENT_DATA);
  this.dataSource = new MatTableDataSource<EvaluationTable>(this.ELEMENT_DATA);
}


getTable(data:any)
{
  this.ColabluationService.GetColaboradorEvaluationsWithParams(data)
  .then((response:any) => {
    
    this.ListPersonal=response;
    this.transformList();

   // this.dataSource = new MatTableDataSource(this.ListPersonal);
    console.log('Response from the request:', this.ListPersonal);

   
  })
  .catch((error:any) => {
    console.error('Error in the request:', error);
    // Handle errors here
  });
}
  ngOnInit() {
    this.ELEMENT_DATA=[]; //Limpiar los datos antes de entrar
    let data = {
      user_id: 18,
      collaborators_id: [],
      evaluations_id: []
    };
 
  this.getTest(data);


 
}
}
export interface EvaluationTable {
  Evaluacion: string;
  Estatus: string;
  Avance: string;
  Colaborador: string;
  Detail: Details[] ;
}
export interface Details {
  Evaluacion: string;
  Etapa: string;
  Clasificacion: string;
  Estatus: string;
  Calificacion?:number|null;
  Avance:number
  Activo:boolean;
}


  

