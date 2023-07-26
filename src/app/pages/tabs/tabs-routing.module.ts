import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard} from "../../core/guards/auth.guard";
import {Dashboard} from "../dashboard/dashbaord.component";
import {DASHBOARD} from "../../core/constants/router.constants";
import {Finance} from "../finances/finance.component";
import {Settings} from "../settings/settings.component";

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        component:Dashboard
      },
      {
        path: 'finances',
        component:Finance      },
      {
        path: 'settings',
        component:Settings      },
      {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
