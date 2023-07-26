import {Component, OnDestroy, OnInit} from '@angular/core';
import {SETTINGS, SIGN_UP_FROM_GUEST, START_SCREEN} from "../../core/constants/router.constants";
import {FirebaseMessaging, GetTokenOptions} from "@capacitor-firebase/messaging";
import {environment} from "../../../environments/environment";
import {Capacitor} from "@capacitor/core";
import {HttpService} from "../../core/services/http.service";
import {ColorSchemeService} from "../../core/services/color-scheme.service";
import {NavigationEnd, Router} from "@angular/router";
import {LanguageEnum} from "../../core/enum/language.enum";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyEnum} from "../../core/enum/currency.enum";
import {ThemeEnum} from "../../core/enum/theme.enum";
import {Device} from "@capacitor/device";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {AuthService} from "../../core/services/auth.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-tab3',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class Settings implements OnDestroy,OnInit{
  SETTINGS: string = SETTINGS;
  alerts: boolean = false;
  showAlerts:boolean=true;
  isUserGuest:boolean=false;
  deviceId:string;
  colorScheme: ThemeEnum;
  language: LanguageEnum;
  ENGLISH: LanguageEnum= LanguageEnum.ENGLISH;
  GERMAN: LanguageEnum= LanguageEnum.GERMAN;
  currency: CurrencyEnum;
  EURO: CurrencyEnum= CurrencyEnum.EURO;
  DOLLAR: CurrencyEnum= CurrencyEnum.DOLLAR;
  AUTO: ThemeEnum= ThemeEnum.AUTO;
  DARK: ThemeEnum= ThemeEnum.DARK;
  LIGHT: ThemeEnum= ThemeEnum.LIGHT;
  SIGN_UP_FROM_GUEST: string = SIGN_UP_FROM_GUEST;


  constructor(
    private httpService: HttpService,
    private readonly colorSchemeService: ColorSchemeService,
    private router: Router,
    private translationService: TranslateService,
    private authService:AuthService,
    public navCtrl: NavController
  ) {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", {event});
    });
    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", {event});
    });
    if (Capacitor.getPlatform() === "web") {
      navigator.serviceWorker.addEventListener("message", (event: any) => {
        console.log("serviceWorker message: ", {event});
        const notification = new Notification(event.data.notification.title, {
          body: event.data.notification.body,
        });
        notification.onclick = (event) => {
          console.log("notification clicked: ", {event});
        };
      });
    }
  }

  async colorSchemeChanged() {
    await this.colorSchemeService.setColorScheme(this.colorScheme);
    await this.httpService.updateUserSettingsForDevice({theme: this.colorScheme,deviceId:this.deviceId})
  }


  async ngOnInit() {
    await this.init()
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd && event.url===SETTINGS) {
        await this.init()
      }
    });
  }
  async init(){
    const fp =(await FingerprintJS.load()).get()
    this.deviceId=Capacitor.getPlatform()==='web'? 'web' :(await Device.getId()).identifier
    const settings=await this.httpService.getSettingsForDeviceAndUser(this.deviceId)
    this.language=settings.language
    this.currency=settings.currency
    this.colorScheme=settings.theme
    this.showAlerts= Capacitor.getPlatform()!=='web';
    this.isUserGuest= await this.httpService.isUserGuest();
  }

  public async requestPermissions(): Promise<void> {
    const fp =(await FingerprintJS.load()).get()
    let deviceId=Capacitor.getPlatform()==='web'? 'web' :(await Device.getId()).identifier
    if (this.alerts) {
      let isGranted = (await FirebaseMessaging.checkPermissions()).receive
      if (isGranted === 'granted'){
        let existingPush=await this.httpService.findPush(deviceId)
        if(existingPush) {
          await this.httpService.enablePush({deviceId})
        }else{
          const options: GetTokenOptions = {
            vapidKey: environment.firebase.vapidKey,
          };
          const {token} = await FirebaseMessaging.getToken(options);
          await this.httpService.enablePush({notification_token: token, deviceId})
        }
      }
      if (isGranted === 'denied') {
        let result = await FirebaseMessaging.requestPermissions();

        if (result.receive === 'granted') {
          const options: GetTokenOptions = {
            vapidKey: environment.firebase.vapidKey,
          };

          const {token} = await FirebaseMessaging.getToken(options);
          await this.httpService.enablePush({notification_token: token, deviceId})
        }
      }
      } else {
        await this.httpService.disablePush({deviceId})
      }
    await this.httpService.updateUserSettingsForDevice({alerts: this.alerts,deviceId:this.deviceId})
  }

  async saveLanguage() {
    this.translationService.setDefaultLang(this.language)
    await this.httpService.updateUserSettingsForDevice({language: this.language,deviceId:this.deviceId})
  }

  async saveCurrency() {
    await this.httpService.updateUserSettingsForDevice({currency: this.currency,deviceId:this.deviceId})
  }

  async signOut(){
    await this.authService.onSignOut()
    await this.router.navigate([START_SCREEN], {replaceUrl: true});
  }

  ngOnDestroy() {
  }

  goToSignUpFromGuest() {
    this.router.navigate([SIGN_UP_FROM_GUEST],{replaceUrl:true})
  }
}
