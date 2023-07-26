import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {START_SCREEN} from "../../../constants/router.constants";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashbaord.component.scss']
})
export class Dashboard {

  constructor(private authService:AuthService,private router:Router) {

  }

  signOut(){
    this.authService.onSignOut();
    this.router.navigate([START_SCREEN]);
  }

}
