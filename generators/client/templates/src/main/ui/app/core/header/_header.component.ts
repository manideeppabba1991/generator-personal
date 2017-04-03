import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jbh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  @Output() sidebarOpenEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  //applicationName: string = 'Master Data Management';
  isSidebarOpen: boolean = false;
  private isFullScreen: boolean = false;

  getFullScreenIcon():any {
    return this.isFullScreen ? 'icon-size-actual':'icon-size-fullscreen';
  }

  toggleFullScreen() {
    let doc:any = window.document;
    let docEl:any = doc.documentElement;

    let requestFullScreen:any = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen:any = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
      this.isFullScreen = true;
    }
    else {
      cancelFullScreen.call(doc);
      this.isFullScreen = false;
    }
  }

  toggleMobleSidebar():any {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarOpenEvent.emit(this.isSidebarOpen);
  }
}
