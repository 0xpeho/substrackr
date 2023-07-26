import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import {AuthCredentialsDto} from "../dto/auth-credentials.dto";
import {AccessTokenDto} from "../dto/access-token.dto";
import {ACCESS_TOKEN_LOCAL_STORAGE_KEY} from "../constants/auth.constants";
import {NoneVoidFunctionType} from "../types/none-void-function.type";
import {FirebaseMessaging, GetTokenOptions} from "@capacitor-firebase/messaging";
import {environment} from "../../../environments/environment";
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService{
  private isAuth = new BehaviorSubject(false);
  private isGuest = new BehaviorSubject(false);
  private onAuthSuccessCallbacks: NoneVoidFunctionType[] = [];
  private onSignOutCallbacks: NoneVoidFunctionType[] = [];

  constructor(private httpService: HttpService) {}

  public async init(): Promise<void> {
    await this.autoSignIn();
  }


  private async autoSignIn(): Promise<void> {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

    if (storedAccessToken && (await this.verifyAccessToken())) {
      this.isAuth.next(true);
      this.invokeOnAuthSuccessCallbacks();
      return;
    }
  }

  public async signIn(credentials:AuthCredentialsDto): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signIn(credentials);

      this.onAuthSuccess(result);
    } catch (err) {
      throw new Error()
    }
    return;
  }

  public async signInAsGuest(deviceId:string): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signInAsGuest({deviceId});
      this.isGuest.next(true)
      this.onAuthSuccess(result);
    } catch (err) {
      throw new Error()
    }
    return;
  }


  public async signUp(credentials:AuthCredentialsDto): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signUp(credentials);
      this.onAuthSuccess(result);
    } catch (err) {
      throw new Error();
    }
    return;
  }

  public onSignOut() {
    this.isAuth.next(false);

    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

    this.invokeOnSignOutCallbacks();
  }


  private onAuthSuccess(accessToken: AccessTokenDto): void {
    this.isAuth.next(true);

    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken.accessToken);


    this.invokeOnAuthSuccessCallbacks();

  }


  private async verifyAccessToken(): Promise<boolean> {
    try {
      await this.httpService.verifyToken();

      return true;
    } catch (err) {
      return false;
    }
  }



  public isAuthenticated(): BehaviorSubject<boolean> {
    return this.isAuth;
  }

  public isUserGuest(): BehaviorSubject<boolean> {
    return this.isGuest;
  }


  public registerOnAuthSuccessCallback(fn: NoneVoidFunctionType): void {
    this.onAuthSuccessCallbacks.push(fn);
  }

  public registerOnSignOutCallback(fn: NoneVoidFunctionType): void {
    this.onSignOutCallbacks.push(fn);
  }

  private invokeOnAuthSuccessCallbacks(): void {
    this.onAuthSuccessCallbacks.forEach((fn: NoneVoidFunctionType) => fn());
  }

  private invokeOnSignOutCallbacks(): void {
    this.onSignOutCallbacks.forEach((fn: NoneVoidFunctionType) => fn());
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<string> {
    const options: GetTokenOptions = {
      vapidKey: environment.firebase.vapidKey,
    };
    if (Capacitor.getPlatform() === "web") {
      options.serviceWorkerRegistration =
        await navigator.serviceWorker.register("firebase-messaging-sw.js");
    }
    const {token} = await FirebaseMessaging.getToken(options);
    return token;
  }
}
