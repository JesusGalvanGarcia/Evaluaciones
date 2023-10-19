import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './Tables.component';

import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
   
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [TablesComponent],
  bootstrap: [TablesComponent],
  exports:[TablesComponent]

})
export class TablesModule { }
