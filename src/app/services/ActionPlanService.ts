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
  private api_conect: any;

  constructor(private http: HttpClient) {

    this.api_conect = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.token
      },
    })
  }

  GetAction(data: any, id: number): Promise<any> {

    return this.api_conect.get(this.controllerUrl + '/' + id, { params: data })
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  GetActionValues(data: any, id: string): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl + "/" + id, { params: data })
      .then((response) => {
        return response.data.action_plan;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  SaveAgreement(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl, data)
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  UpdateAgreement(data: any, user_action_plan_id: number): Promise<any> {

    return this.api_conect.put(this.controllerUrl + '/' + user_action_plan_id, data)
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  confirmActionPlan(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl + '/confirmActionPlan', data)
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
        console.log(data)
        throw data;
      });
  }

  saveSignature(data: any): Promise<any> {

    return this.api_conect.post(this.controllerUrl + '/storeSignature', data)
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


