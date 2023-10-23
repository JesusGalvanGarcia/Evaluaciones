import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';  // Importa el operador map
import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PersonalEvaluationService {
  private controllerUrl = 'user-evaluations';

  constructor(private http: HttpClient) { }
   GetPersonalEvaluationsWithParams(data: any): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl, {
      params: data
    })
    .then((response) => {
      return response.data.personal_evaluations;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
}


