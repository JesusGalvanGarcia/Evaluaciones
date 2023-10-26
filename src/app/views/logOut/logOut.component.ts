import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingComponent } from '../loading/loading.component';
@Component({
  selector: 'app-logOut',
  standalone:true,
  templateUrl: './logOut.component.html',
  styleUrls: ['./logOut.component.css'],
  imports: [
    LoadingComponent
  ],
})
export class LogOutComponent implements OnInit {
  protected isLoading: boolean = false;

  constructor(    private router: Router
    ) { }
  logOut()
  {
    this.isLoading=true;
    localStorage.setItem("token", "");
    localStorage.setItem("user_id", "");
    localStorage.setItem("email", "");
    this.router.navigate(['/login']);
    this.isLoading=false;
  }
  ngOnInit() {
    this.logOut();
  }

}
