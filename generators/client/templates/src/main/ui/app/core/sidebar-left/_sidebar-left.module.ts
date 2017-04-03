import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarLeftComponent } from './sidebar-left.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarLeftComponent],
  exports: [SidebarLeftComponent]
})
export class SidebarLeftModule { }
