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
  private api_conect: any;
  constructor(private http: HttpClient, public messageService: MensajeService) {
    this.api_conect = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.token
      },
    })
  }

  GetEvaluation(data: any, id: number): Promise<any> {

    return this.api_conect.get(this.controllerUrl + id, { params: data })
      .then(({ data }: any) => {

        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  async SendTestEvaluation(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl + "saveAnswer", data)
      .then(({ data }: any) => {
        console.log(data)
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }
  async SendChangeProcess(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl + "changeProcess", data)
      .then(({ data }: any) => {
        console.log(data)
        return data.tests;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }
  SendTestNote(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl + "saveModuleNote", data)
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }
}
