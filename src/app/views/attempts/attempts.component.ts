import { Component, OnInit } from '@angular/core';
import { Injectable, EventEmitter } from '@angular/core';
import { PLDUserService } from '@services/pldUser.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

import { UserTest } from '@models/testDetails/saveTest';
@Component({
  selector: 'app-attempts',
  standalone:true,
  imports: [CommonModule,LoadingComponent],

  templateUrl: './attempts.component.html',
  styleUrls: ['./attempts.component.css']
})
export class AttemptsComponent implements OnInit {
  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();
  test:Evaluation[];
  max:number;
  isLoading: boolean = true;

  constructor(public pld:PLDUserService) { }

  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
 
    };
    this.getDetail(data);
  }
  getNumber(data:string)
  {
    return Number(data);
  }
   getDetail(data:any)
   {
    this.pld.GetDetail(data, Number(localStorage.getItem("evaluation_id")))
    .then((data) => {
       console.log(data)  //Obtener detalles
     this.test=data;
     let maxValue = this.test.reduce((max, item) => Math.max(max, Number(item.total_score)), -Infinity);
     this.max=maxValue;
     this.isLoading=false;
    })
    .catch((error: any) => {
      console.error('Error in the request:', error);
    
      // Handle errors here
    });
   }
}
export interface Evaluation {
  id: number;
  test_id: string;
  total_score: string;
  status_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  finish_date: string;
  user_evaluation_id: string;
  attempts: string;
  max_attempts: string;
  max_score: string;
  min_score: string;
  correct_answers_count:string;
}