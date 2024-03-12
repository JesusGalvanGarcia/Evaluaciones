import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { navbarDataAdmin } from './nav-data';
import { navbarDataAdminEvaluaciones } from './nav-data';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  navData = navbarData;
   
  navDataCopy = navbarDataAdmin;
  
  navDataEvaluacion=navbarDataAdminEvaluaciones;      
  user:number;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  
    if(this.screenWidth <= 768 ) {
      this.collapsed = true;
   
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  constructor(public router: Router) {
    this.collapsed=false;
   
  }

  ngOnInit(): void {
      this.user=Number(localStorage.getItem("user_id"));
      if(this.user==16||this.user==67)
      this.navData=this.navDataCopy;
      if(this.user==19||this.user==88)
      this.navData=this.navDataEvaluacion;

      this.screenWidth = window.innerWidth;
      if(this.screenWidth <= 768 ) {
        this.collapsed = true;
      }
  }
  
  toggleCollapse(): void {
 
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
     
  }

  closeSidenav(): void {

    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
   
  }

  handleClick(item: INavbarData): void {

    this.shrinkItems(item);
    item.expanded = !item.expanded
    
  }

  getActiveClass(data: INavbarData): string {

    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
