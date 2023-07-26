import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../../core/services/http.service";
import {SubscriptionDto} from "../../core/dto/subscription.dto";
import {NavigationEnd, Router} from "@angular/router";
import {DASHBOARD, NEW_SUBSCRIPTION, SUBSCRIPTION} from "../../core/constants/router.constants";
import {TranslateService} from "@ngx-translate/core";
import {LanguageEnum} from "../../core/enum/language.enum";
import {Device} from "@capacitor/device";
import {SettingsDto} from "../../core/dto/settings.dto";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {Capacitor} from "@capacitor/core";
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashbaord.component.scss']
})
export class Dashboard implements OnInit,OnDestroy{

  public subs:SubscriptionDto[];
  public settingsDto:SettingsDto
  DASHBOARD: string= DASHBOARD;

  constructor(private httpService:HttpService,private navController: NavController,
              private translateService:TranslateService, private router:Router) {

  }

  async ngOnInit() {
    await this.init()
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd && event.url===DASHBOARD) {
        await this.init()
      }
    });
  }
    async init(){
    try {
      //const fp =(await FingerprintJS.load()).get()
      let deviceId=Capacitor.getPlatform()==='web'? 'web' :(await Device.getId()).identifier
      this.settingsDto = await this.httpService.getSettingsForDeviceAndUser(deviceId);
    } catch (err) {
      this.translateService.setDefaultLang(this.setLanguage());
    }
    if (this.settingsDto) {
      this.translateService.setDefaultLang(this.settingsDto.language);
    } else {
      this.translateService.setDefaultLang(this.setLanguage());
    }

      this.subs = await this.httpService.getSubscriptions();
  }

  openCard(index:number){
    this.navController.navigateForward([SUBSCRIPTION,this.subs[index].id],{replaceUrl:true});
  }


  private setLanguage(): string {
    if (navigator.language.startsWith('de')) {
      return LanguageEnum.GERMAN;
    } else {
      return navigator.language;
    }
  }

  goToCreate() {
    this.navController.navigateForward(NEW_SUBSCRIPTION,{replaceUrl:true})
  }

  countProperties(obj:any) {
    let count:number = 0;

    for (const key in obj) {
      if ((key==='description'|| key==='paymentType'|| key==='category'|| key==='expirationDate')&&obj.hasOwnProperty(key) && obj[key] !== null) {
        Number(count++);
      }
    }

    return {
      3: 'grid-rows-3 gap-8',
      4: 'grid-rows-4 gap-2.5',
      5: 'grid-rows-5 max-h-[200px]',
    }[count+1];
  }

  ngOnDestroy() {
  }

}
