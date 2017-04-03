import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren : "app/features/dashboard/dashboard.module#DashboardModule",
    data:{
      createSidebarEntry : true,
      pathDisplayText: "Dashboard",
      pathIcon: `icon icon-home pull-right`,
      order: 1
    }
  },
  {
    path: 'settings',
    loadChildren : "app/features/settings/settings.module#SettingsModule",
    data:{
      createSidebarEntry : true,
      pathDisplayText: "Settings",
      pathIcon: `icon icon-settings pull-right`,
      order: 2
    }
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
