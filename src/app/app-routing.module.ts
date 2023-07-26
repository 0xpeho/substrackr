import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {StartScreenComponent} from "./pages/start-screen/start-screen.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {NotAuthGuard} from "./core/guards/not-auth.guard";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {SubscriptionComponent} from "./pages/subscription/subscription.component";
import {Finance} from "./pages/finances/finance.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  { path:'sign-in', component:SignInComponent,canActivate: [NotAuthGuard]},
  { path:'sign-up', component:SignUpComponent,canActivate: [NotAuthGuard]},
  { path:'sign-up/from-guest', component:SignUpComponent,canActivate: [AuthGuard]},
  { path:'start-screen', component:StartScreenComponent,canActivate: [NotAuthGuard]},
  { path:'subscription/:id', component:SubscriptionComponent,canActivate: [AuthGuard]},
  { path:'new-subscription', component:SubscriptionComponent,canActivate: [AuthGuard]},
  { path:'finances', component:Finance,canActivate: [AuthGuard]},


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
