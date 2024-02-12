import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Evaluation360Service {
  private controllerUrl = 'evaluation360';

  constructor(private http: HttpClient) { }
  changeStatus(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/changeStatus", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  getFinished(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/getFinish360", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  getPlans(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/actionPlan", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  getPersonal360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/get360", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  getPersonalIndex360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/getPersonal360", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  Get360(data: any): Promise<any> {

    return axios.get(environment.apiUrl+this.controllerUrl, {
      params: data
    })
    .then((response) => {
      return response.data;
      })      
    .catch(function (error: any) {
      console.log(error)
      throw error;
    });
  }
  GetUsersSelect360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/Users", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  GetUsersAssing360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/Users360", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  Assing360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/assign", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  AssingAsesors(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/assignAsesors", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  Assing360Users(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/assign360", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  GetAssing360(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/assignUsers", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  GetUsers360(data: any,id:any): Promise<any> {

    return axios.get(environment.apiUrl+this.controllerUrl+"/"+id, {
      params: data
    })
    .then((response) => {
      return response.data;
      })      
    .catch(function (error: any) {
      console.log(error)
      throw error;
    });
  }
  
}


