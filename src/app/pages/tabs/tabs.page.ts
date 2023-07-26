import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {HttpService} from "../../core/services/http.service";
import {SIGN_IN, SIGN_UP, SIGN_UP_FROM_GUEST, START_SCREEN} from "../../core/constants/router.constants";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  notifications:number=0;
  constructor(private router:Router,private httpService:HttpService ) {
  }

  async ngOnInit() {
    await this.getNotifications();
  }

  async goToTab(url: string) {
    this.router.navigate([url]);
    await this.getNotifications();
  }

  async getNotifications(){
    let subs = await this.httpService.getSubscriptions()
    this.notifications=subs.filter(e=>e.hasBeenNotified).length
  }
}
