import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { navbarDataAdmin } from './nav-data';
import { navbarDataAdminEvaluaciones } from './nav-data';
import {ToolService} from '@services/tools.service';
import { LoadingComponent } from '../loading/loading.component';

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
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
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
  navData :any=[];
   
  navDataCopy = navbarDataAdmin;

  navDataEvaluacion = navbarDataAdminEvaluaciones;
  user: number;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth <= 768) {
      this.collapsed = true;

      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(public router: Router,public toolsService: ToolService) {
    this.collapsed=false;
   
  }
  
  ngOnInit(): void {
      this.user=Number(localStorage.getItem("user_id"));
      //this.navData=this.navDataCopy;
      this.getTool(this.user);
      this.screenWidth = window.innerWidth;
      if(this.screenWidth <= 768 ) {
        this.collapsed = true;
      }
  }
  getTool(user:any)
  {
       this.toolsService.getTools(user)
       .then((response: any) => {
        this.navData=response;
        console.log(this.navData)
      })
    
  }
  toggleCollapse(): void {

    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });

  }

  closeSidenav(): void {

    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });

  }

  handleClick(item: INavbarData): void {

    this.shrinkItems(item);
    item.expanded = item.expanded=="true"?"false":"true"
    
  }

  getActiveClass(data: INavbarData): string {

    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
   
      if(item.menu_items.length==0)
      {
        this.router.navigate([item.routeLink]);
      }
      else
      {
        for(let modelItem of item.menu_items) {

          modelItem.expanded = modelItem.expanded =="false"?"true":"false";

      }
      }
    }
  
}
