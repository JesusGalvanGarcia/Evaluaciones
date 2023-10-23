import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {
  private controllerUrl = 'user-actionPlan';

  constructor(private http: HttpClient) { }
   GetAction(data: any,id:string): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl+"/"+id, {
      params: data
    })
    .then((response) => {
      return response.data.action_plan;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
  GetActionValues(data: any,id:string): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl+"/"+id, {
      params: data
    })
    .then((response) => {
      return response.data.action_plan;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
  SaveActionPlan(data: any): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl, {
      params: data
    })
    .then((response) => {
      return response.data.action_plan;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
}


