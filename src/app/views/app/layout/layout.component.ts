import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GeneralConstant } from '@utils/general-constant';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  
  constructor(
    private router: Router,
  
   
  ) { }

  ngOnInit() {
   
  }



  protected logout()
  {
    localStorage.removeItem(GeneralConstant.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

}
