import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {initializeAppFactory} from "./app.initializer";
import {StartScreenComponent} from "./pages/start-screen/start-screen.component";
import {AuthService} from "./core/services/auth.service";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {HeaderComponent} from "./components/header/header.component";
import {SubscriptionComponent} from "./pages/subscription/subscription.component";
import {Dashboard} from "./pages/dashboard/dashbaord.component";
import {Finance} from "./pages/finances/finance.component";
import {Settings} from "./pages/settings/settings.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {LanguageEnum} from "./core/enum/language.enum";


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    StartScreenComponent,
    SignUpComponent,
    HeaderComponent,
    SubscriptionComponent,
    Dashboard,
    Finance,
    Settings],
  imports: [ReactiveFormsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, IonicModule, HttpClientModule,
    TranslateModule.forRoot({
    defaultLanguage: LanguageEnum.GERMAN,
    loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
      deps: [HttpClient],
    },
  })
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [
    HeaderComponent
  ]
})
export class AppModule {}
