import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gender } from '@dtos/catalog/gender';
import { GenderSelectorDTO } from '@dtos/catalog/gender-selector-dto';

@Injectable()
export class GendersService {
  private controllerUrl = 'genders';
  constructor(private http: HttpClient) { }


  public getAll(): Observable<Gender[]>{
    return this.http.get<Gender[]>(this.controllerUrl);
  }

  public getAllSelector(): Observable<GenderSelectorDTO[]>{
    return this.http.get<GenderSelectorDTO[]>(this.controllerUrl + '/selector');
  }
}