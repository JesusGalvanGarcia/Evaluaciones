import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginService } from '@services/login.service';
import { TokenInterceptor } from '@http/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AgGridModule } from 'ag-grid-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { SublevelMenuComponent } from './views/sidenav/sublevel-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SurveyModule } from "survey-angular-ui";
import { TablesModule } from './views/plan/plan.module';
import { SurveyComponent } from "../app/views/desempeño/desempeño.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UserTestComponent } from './views/user-test/user-test.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
