import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserEvaluationService {
  private controllerUrl = 'user-evaluations';

  constructor(private http: HttpClient) { }
  GetTest(data: any,id:string): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl+"/"+id, {
      params: data
    })
      .then((response) => {
        return response.data.tests;
      })
      .catch(function (error: any) {
        return error;
      });
  }


  GetColaboradorEvaluationsWithParams(data: any): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl, {
      params: data
    })
    .then((response) => {
      return response.data;
      })      
    .catch(function (error: any) {
     
      throw error;
    });
  }
  Get360(data: any): Promise<any> {

    return axios.get(environment.apiUrl+this.controllerUrl+"/index360", {
      params: data
    })
    .then((response) => {
      return response.data;
      })      
    .catch(function (error: any) {
     
      throw error;
    });
  }

  GetPersonalEvaluationsWithParams(data: any): Promise<any> {
  
    return axios.get(environment.apiUrl+this.controllerUrl, {
      params: data
    })
    .then((response) => {
    
      return response.data.personal_evaluations;
      })      
    .catch(function (error: any) {
  

      throw error;
    });
  }

}


