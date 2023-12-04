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
import { TokenInterceptor } from '@http/token.interceptor';
import { LoginService } from '@services/login.service';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SurveyModule } from "survey-angular-ui";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TablesModule } from './views/plan/plan.module';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { SublevelMenuComponent } from './views/sidenav/sublevel-menu.component';
import { UserTestComponent } from './views/user-test/user-test.component';
import { LoadingComponent } from './views/loading/loading.component';

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    isAnimated: true, 
    dateInputFormat: 'DD/MM/YYYY', 
    selectFromOtherMonth: true, 
    adaptivePosition: true,
  });
}


import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    SublevelMenuComponent,
    UserTestComponent,
  ],
  imports: [
    LoadingComponent,
    BrowserModule,
    AppRoutingModule,
    TablesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
  constructor(){
    registerLocaleData(localeEs, 'es');
  }
}
