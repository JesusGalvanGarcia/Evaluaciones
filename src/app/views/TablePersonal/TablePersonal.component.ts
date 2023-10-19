import {  OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { PersonalEvaluationService } from '../../services/PersonalEvaluationService';
import { PersonalEvaluation } from 'src/app/models/PersonalEvaluation/PersonalEvaluation';
import {TestService} from "../../services/TestService";
import { TestModel } from 'src/app/models/ColaboradorEvaluation/EvaluationDetail';

@Component({
  selector: 'app-TablePersonal',
  templateUrl: './TablePersonal.component.html',
  styleUrls: ['./TablePersonal.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TablePersonalComponent implements OnInit {
  title = 'angularmaterial';
  obj: EvaluationTable;
  objDetail: Details;
  ListTest:TestModel[];
  ListDetail: Details[];
   ELEMENT_DATA: EvaluationTable[] = []
 // dataSource = new MatTableDataSource<EvaluationTable>([]);
  ListPersonal:PersonalEvaluation[];
  //Columns names, table data from datasource, pagination and sorting
  columnsToDisplay: string[] = ['Evaluacion', 'Estatus', 'Avance'];
  dataSource = new MatTableDataSource<EvaluationTable>(this.ELEMENT_DATA);
  dataSourcePersonal = new MatTableDataSource<PersonalEvaluation>();
  expandedElement: EvaluationTable | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  constructor(private personalEvaluationService: PersonalEvaluationService,private testService:TestService) { }
getTable(data:any)
{
  this.personalEvaluationService.GetPersonalEvaluationsWithParams(data)
  .then((response:any) => {
    this.ListPersonal=response;
    this.transformList();
    console.log('Response from the request:', this.ListPersonal);
    // You should handle the response data here.
  })
  .catch((error:any) => {
    console.error('Error in the request:', error);
    // Handle errors here
  });
}
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
  // Transforma la lista de datos recibidos a los que están en la tabla
  this.ListPersonal.forEach((element: PersonalEvaluation) => {
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
      Evaluacion:"Evaluacion diciembre 2023",
      Estatus: element.status,
      Avance: element.actual_process, // ¿Qué tipo de datos debería ir aquí?
      Terminado: false, // Cambio realizado aquí
      Colaborador: element.collaborator_name,
      Detail: listDetail,
    };

    this.ELEMENT_DATA.push(this.obj);
  });

  console.log(this.ELEMENT_DATA);
  this.dataSource = new MatTableDataSource<EvaluationTable>(this.ELEMENT_DATA);
}

  ngOnInit() {
    let data = {
      user_id: 18,
      collaborators_id: [],
      evaluations_id: []
    };
    this.getTest(data);

  }

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

export interface EvaluationTable {
  Evaluacion: string;
  Estatus: string;
  Avance: string;
  Colaborador: string;
  Terminado:boolean;
  Detail: Details[] ;

}

