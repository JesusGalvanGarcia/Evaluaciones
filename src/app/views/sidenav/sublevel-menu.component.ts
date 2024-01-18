import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul *ngIf="data.items && data.items.length > 0"
    [@submenu]="expanded
      ? {value: 'visible', 
          params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
      : {value: 'hidden', 
          params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
      class="sublevel-nav"
    >
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
          <a class="sublevel-nav-link"
        
            *ngIf="item.items && item.items.length > 0"
          
          >
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" @fadeInOut 
                >{{item.label}}</span>
            <i *ngIf="item.items " class="menu-collapse-icon"
              [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"
            ></i>
          </a>
          <a class="sublevel-nav-link"
            *ngIf="!item.items || (item.items && item.items.length === 0)"
            [routerLink]="[item.routeLink]"
            routerLinkActive="active-sublevel"
         
            [routerLinkActiveOptions]="{exact: true}"
          >
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" @fadeInOut    
               (click)="test()">{{item.label}} </span>
          </a>
       
      </li>
    </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({overflow: 'hidden'}), 
        animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }
  @Input() collapsed = true;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;
@Input() close: () => void;

  constructor(public router: Router) {}
test()
{
  this.collapsed=!this.collapsed;

}
  ngOnInit(): void {
  }


}
