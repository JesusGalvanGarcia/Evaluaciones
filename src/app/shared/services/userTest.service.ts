import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeService } from '@http/mensaje.service';


import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserTestService {
  private controllerUrl = 'user-tests/';
  private api_conect: any;
  constructor(private http: HttpClient, public messageService: MensajeService) {
 
  }

  GetEvaluation(data: any, id: number): Promise<any> {

    return axios.get(environment.apiUrl+this.controllerUrl+ id, { params: data })
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {
        const { data } = response
       
        throw data;
      });
  }
  GetExam(data: any, id: number): Promise<any> {
  
    return axios.get(environment.apiUrl+this.controllerUrl+  id,  {
      params: data
    })
    .then((data) => {
       
        return data;
      })
      .catch((response) => {

        const { data } = response
       
        throw data;
      });
  }

  async SendTestEvaluation(data: any): Promise<any> {

    return axios.post(environment.apiUrl +this.controllerUrl+  "saveAnswer", data)
      .then(({ data }: any) => {
        
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
      
        throw data;
      });
  }
 
  async SendChangeProcess(data: any): Promise<any> {

    return axios.post(environment.apiUrl +this.controllerUrl+  "changeProcess", data)
      .then(({ data }: any) => {
      
        return data.tests;
      })
      .catch(({ response }: any) => {

        const { data } = response
       
        throw data;
      });
  }
  SendTestNote(data: any): Promise<any> {

    return axios.post(environment.apiUrl +this.controllerUrl+  "saveModuleNote", data)
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
      
        throw data;
      });
  }
}
