import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService {

  private controllerUrl = 'iSpring/user-courses';

  constructor(private http: HttpClient) { }

  GetUserCourses(data: any): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl, { params: data })
      .then(({ data }: any) => {

        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
}
