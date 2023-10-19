import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginService } from '@services/login.service';
import { TokenInterceptor } from '@http/token.interceptor';
import { FormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AgGridModule } from 'ag-grid-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { SublevelMenuComponent } from './views/sidenav/sublevel-menu.component';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SurveyModule } from "survey-angular-ui";
import { TablesModule } from './views/plan/plan.module';
import { SurveyComponent } from "../app/views/desempeño/desempeño.component";
@NgModule({
  declarations: [	
    AppComponent,
      SidenavComponent,
      SublevelMenuComponent,
      
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TablesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AgGridModule,
    SurveyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {hideRequiredMarker: true} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
