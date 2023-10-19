import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePersonalComponent } from './TablePersonal.component';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { PersonalEvaluationService } from '../../services/PersonalEvaluationService';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    
    MatButtonModule
  ],
  providers:[PersonalEvaluationService],
  declarations: [TablePersonalComponent],
  exports:[TablePersonalComponent]
})
export class TablePersonalModule { }
