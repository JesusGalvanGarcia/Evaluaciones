import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';

import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // o 'ReactiveFormsModule' si estás usando formularios reactivos

@NgModule({
  imports: [
    
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    CommonModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [PlanComponent],
  bootstrap: [PlanComponent],
  exports:[PlanComponent]

})
export class TablesModule { }
