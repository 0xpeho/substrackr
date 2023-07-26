import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from './http.service';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, REFRESH_TOKEN_LOCAL_STORAGE_KEY } from '../../shared/constants/auth.constant';
import { AccessRefreshTokenDto } from '../dtos/auth/access-refresh-token.dto';
import jwt_decode from 'jwt-decode';
import { NoneVoidFunctionType } from '../types/none-void-function.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private isAuth = new BehaviorSubject(false);
  private autoSignInTimeout: NodeJS.Timeout;
  private onAuthSuccessCallbacks: NoneVoidFunctionType[] = [];
  private onSignOutCallbacks: NoneVoidFunctionType[] = [];

  constructor(private httpService: HttpService) {}

  public async init(): Promise<void> {
    await this.autoSignIn();
    this.setAutoSignInTimeout();
  }

  public ngOnDestroy(): void {
    if (this.autoSignInTimeout) {
      clearTimeout(this.autoSignInTimeout);
    }
    this.invokeOnSignOutCallbacks();
  }

  private async autoSignIn(): Promise<void> {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

    if (storedAccessToken && (await this.verifyAccessToken())) {
      this.isAuth.next(true);
      this.invokeOnAuthSuccessCallbacks();
      return;
    }

    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);

    if (storedAccessToken && storedRefreshToken) {
      await this.refreshToken(storedAccessToken, storedRefreshToken);
    }
  }

  public async signIn(email: string, password: string): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signIn({ email, password });

      this.onAuthSuccess(result);
    } catch (err) {
      throw new UnauthorizedError(err.error.error, err.error.message);
    }
    return;
  }

  public async signInForUser(userId: string, token: string): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signInForUser({ userId, token });

      this.onAuthSuccess(result);
    } catch (err) {
      throw new UnauthorizedError(err.error.error, err.error.message);
    }
    return;
  }

  public async signUp(email: string, password: string): Promise<void> {
    if (this.isAuth.getValue()) {
      return;
    }

    try {
      const result = await this.httpService.signUp({ email, password });

      // disable auto sign-in after signup
      // this.onAuthSuccess(result);
    } catch (err) {
      throw new UnauthorizedError(err.error.error, err.error.message);
    }
    return;
  }

  public onSignOut() {
    this.isAuth.next(false);

    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);

    this.invokeOnSignOutCallbacks();
  }

  public async refreshToken(accessToken: string, refreshToken: string): Promise<void> {
    try {
      const result = await this.httpService.refresh({ accessToken, refreshToken });

      this.onAuthSuccess(result);
    } catch (err) {
      this.onSignOut();
    }
  }

  private onAuthSuccess(accessRefreshTokenDto: AccessRefreshTokenDto): void {
    this.isAuth.next(true);

    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessRefreshTokenDto.accessToken);
    localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, accessRefreshTokenDto.refreshToken);

    this.invokeOnAuthSuccessCallbacks();

    this.setAutoSignInTimeout();
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

  private setAutoSignInTimeout(): void {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

    if (storedAccessToken) {
      const accessTokenExpiry = (jwt_decode(storedAccessToken) as { exp: number }).exp;

      const msToAccessTokenExpiry = accessTokenExpiry * 1000 - new Date().getTime();

      if (msToAccessTokenExpiry < 0) {
        return;
      }
      if (this.autoSignInTimeout) {
        clearTimeout(this.autoSignInTimeout);
      }
      this.autoSignInTimeout = setTimeout(this.autoSignIn.bind(this), msToAccessTokenExpiry);
    }
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
}
