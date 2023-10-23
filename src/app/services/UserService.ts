import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private controllerUrl = 'login';

  constructor(private http: HttpClient) { }
   PostLogin(data: any): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl, {
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


