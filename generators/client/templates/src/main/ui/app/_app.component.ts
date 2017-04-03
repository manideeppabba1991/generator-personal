import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarLock: boolean = false;
  isSidebarOpen: boolean = false;

  toggleMobleSidebar(e) {
    this.isSidebarOpen = e;
    this.sidebarLock = e;
  }

  onLockSideBar(e){
    this.sidebarLock = e;
    console.log("onLockSideBar ",  this.sidebarLock = e );
  }
}
