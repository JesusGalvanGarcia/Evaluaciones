import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { GridActionButtonComponent } from './grid-action-button/grid-action-button.component';
import { GridComponent } from './grid.component';

@NgModule({
  declarations: [ GridComponent, GridActionButtonComponent ],
  imports: [
    CommonModule,
    AgGridModule,
  ],
  exports: [ GridComponent, GridActionButtonComponent ],
  providers: [],
})
export class GridModule {}
