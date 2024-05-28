import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private controllerUrl = 'iSpring/courses';

  constructor(private http: HttpClient) { }

  GetCourseInfo(iSpring_course_id: string): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl + "/" + iSpring_course_id, {
    })
      .then(({ data }) => {
        return data;
      })
      .catch(function (error: any) {
        return error;
      });
  }
}
