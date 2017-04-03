import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';
import { SidebarLeftModule } from './sidebar-left/sidebar-left.module';
import { SidebarRightModule } from "./sidebar-right/sidebar-right.module";
import { SearchModule } from "./search/search.module";

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SidebarLeftModule,
    SidebarRightModule,
    SearchModule
  ],
  exports: [
    HeaderModule,
    SidebarLeftModule
  ]
})
export class CoreModule { }
