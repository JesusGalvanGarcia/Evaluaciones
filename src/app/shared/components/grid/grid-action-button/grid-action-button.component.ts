import { Component, Input } from '@angular/core';
import { GridActions } from '@utils/grid-action';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridComponent } from './../grid.component';
import { CustomCellRendererParams } from './customCellRendererParams';

@Component({
  selector: 'app-grid-action-button',
  template: `
    <div
  style="display: flex; width: 100%; align-items: center; justify-content: center; height: 100%;"
  [ngClass]="deshabilitar"
>
  <div (click)="onClick()" class="action" [title]="title"> <i [ngClass]="faIconClass"></i> </div>
</div>
  `,
  styleUrls: ['./grid-action-button.component.scss'],
})
export class GridActionButtonComponent implements ICellRendererAngularComp {
  public params!: any;
  @Input() action: string;
  protected faIconClass: string = '';
  private timeout = false;
  @Input() disabled = false;
  @Input() icon: string;
  public deshabilitar = '';
  public title = '';

  constructor(public gridComponent: GridComponent) {

  }

  public agInit(params: CustomCellRendererParams): void {
    this.params = params;
    params.title = params.action;
    this.action = params.action;

    if (params.disabled !== undefined && params.disabled) {
      this.disabled = true;
      this.deshabilitar = 'deshabilitado';
    }
    switch (this.action) {
      
      case GridActions.EDIT:
        this.title = 'Editar';
        this.faIconClass = 'fa-solid fa-pen-to-square';
        break;
      case GridActions.DELETE:
        this.title = 'Eliminar';
        this.faIconClass = 'fa-solid fa-trash';
        break;
        case GridActions.Start:
          this.title = 'Ir al examen';
          this.faIconClass = 'fa-solid fa-arrow-right';
          break;
          case GridActions.Seen:
            this.title = 'Ver';
            this.faIconClass = 'fa-solid fa-eye';
            break;
      default:
        this.title = this.action;
        this.faIconClass = this.icon;
        break;
    }
  }

  public onClick() {
    if (!this.timeout) {
      if (this.action !== undefined && this.action !== '' && !this.disabled) {
        this.gridComponent.actionButton({
          action: this.action,
          data: this.params.data,
        });
        this.timeout = !this.timeout;
        setTimeout(() => {
          this.timeout = !this.timeout;
        }, 1000);
      }
    }
  }

  public refresh(): boolean {
    return false;
  }
}
