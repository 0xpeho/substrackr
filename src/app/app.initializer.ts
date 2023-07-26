import {HttpService} from "./core/services/http.service";
import {AuthService} from "./core/services/auth.service";
import {SubscriptionComponent} from "./pages/subscription/subscription.component";


export function initializeAppFactory(
  authService: AuthService
): () => Promise<void> {
  return () =>
    new Promise<void>(async resolve => {
      await authService.init();
      resolve();
    });
}



