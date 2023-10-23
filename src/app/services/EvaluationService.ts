import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeService } from '@http/mensaje.service';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private controllerUrl = 'user-tests/';
  private api_conect:any;
  constructor(private http: HttpClient, public messageService:MensajeService) 
  {
     this.api_conect = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.token
      },
    })
   }
   GetEvaluation(data: any,id:string): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl+id, {
      params: data
    })
    .then((response) => {
      return response.data.test;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
  SendTestEvaluation(data: any): Promise<any> {
    
    return this.api_conect.post("user-tests/saveAnswer",data)
    .then((response:any) => {
      console.log(response,data)
      return response.data.tests;
      })      
    .catch(function (error: any) {
      console.log(error)

      return error;
    });
  }
  SendTestNote(data: any): Promise<any> {
    
    return axios.post(environment.apiUrl+this.controllerUrl+"saveModuleNote", {
      params: data
    })
    .then((response) => {
      return response.data.tests;
      })      
    .catch(function (error: any) {

      return error;
    });
  }
}
