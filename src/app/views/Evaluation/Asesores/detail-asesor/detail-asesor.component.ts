import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsesoresService } from '@services/Evaluations/Asesores/asesores.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail-asesor',
  templateUrl: './detail-asesor.component.html',
  styleUrls: ['./detail-asesor.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    LoadingComponent,
    CommonModule
  ],
})
export class DetailAsesorComponent implements OnInit {
  displayedColumns: string[] = ['name', 'average', 'max'];
  dataSource: any;
  isLoading:boolean;
  constructor(public service:AsesoresService) { }

  ngOnInit() {
    this.isLoading=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")), 
    };
    this.getDetail(data);
  }
  getDetail(data:any)
  {
   this.service.GetExam(data, Number(localStorage.getItem("evaluation_id")))
   .then((data) => {
   //Obtener detalles
    this.dataSource=data.data.test;
    this.isLoading=false;
   })
   .catch((error: any) => {
     console.error('Error in the request:', error);
   
     // Handle errors here
   });
  }
}
