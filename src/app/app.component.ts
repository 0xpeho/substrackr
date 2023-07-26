import { Component } from '@angular/core';
import {Capacitor} from "@capacitor/core";
import { initializeApp } from "firebase/app";
import {environment} from "../environments/environment";
import {ColorSchemeService} from "./core/services/color-scheme.service";
import {HttpService} from "./core/services/http.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageEnum} from "./core/enum/language.enum";
import {UserDto} from "./core/dto/user.dto";
import {Device} from "@capacitor/device";
import {SettingsDto} from "./core/dto/settings.dto";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {AuthService} from "./core/services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
   constructor(private readonly colorSchemeService: ColorSchemeService,
                    private httpService: HttpService,
                    private translateService: TranslateService,
               private authService:AuthService
  ) {

     this.initializeFirebase();
  }

  public async initializeFirebase(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      return;
    }
    initializeApp(environment.firebase);
  }

  public async ngOnInit(): Promise<void> {
     await this.colorSchemeService.loadStoredTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',async () => await this.colorSchemeService.loadStoredTheme())
    let settings:SettingsDto;

    try {
      if(localStorage.getItem('accessToken')) {
        const fp = (await FingerprintJS.load()).get()
        let deviceId = Capacitor.getPlatform() === 'web' ? 'web' : (await Device.getId()).identifier
        settings = await this.httpService.getSettingsForDeviceAndUser(deviceId);
      }
    } catch (err) {
      this.translateService.setDefaultLang(this.setLanguage());
    }
    //@ts-ignore
    if (settings) {
      this.translateService.setDefaultLang(settings.language);
    } else {
      this.translateService.setDefaultLang(this.setLanguage());
    }
  }

  private setLanguage(): string {
    if (navigator.language.startsWith('de')) {
      return LanguageEnum.GERMAN;
    } else {
      return navigator.language;
    }
  }

}
