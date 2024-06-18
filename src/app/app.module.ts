import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { NgModule } from '@angular/core';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from '@http/login.service';
import { TokenInterceptor } from '@http/token.interceptor';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SurveyModule } from "survey-angular-ui";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './views/app/loading/loading.component';
import { TablesModule } from './views/Evaluation/plan/plan.module';
import { SidenavComponent } from './views/app/sidenav/sidenav.component';
import { SublevelMenuComponent } from './views/app/sidenav/sublevel-menu.component';
import { UserTestComponent } from './views/Evaluation/Desempeño/user-test/user-test.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { UserTest360Component } from './views/Evaluation/Evaluation360/user-test/user-test.component';
import { LoginComponent } from './views/app/login/login.component';
import { Personal360Component } from './views/Evaluation/Evaluation360/personal360/personal360.component';

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    selectFromOtherMonth: true,
    adaptivePosition: true,
  });
}


@NgModule({
  declarations: [

    AppComponent,
    SidenavComponent,
    SublevelMenuComponent,
    UserTestComponent,
    UserTest360Component
  ],
  imports: [
    AngularDualListBoxModule,
    LoadingComponent,
    BrowserModule,
    AppRoutingModule,
    TablesModule,
    ReactiveFormsModule,
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
    MatTooltipModule,
    MatProgressBarModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  providers: [
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { hideRequiredMarker: true } },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEs, 'es');
  }
}
