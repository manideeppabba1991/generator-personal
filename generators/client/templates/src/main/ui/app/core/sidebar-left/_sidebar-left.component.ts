import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'jbh-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})
export class SidebarLeftComponent implements OnInit {

  @Input() sidebarOpenProp:boolean;
  @Output() sidebarLockEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  sidebarOpen: boolean = false;
  sidebarLocked: boolean = false;
  showAppDrawer: boolean = false;

  test : string = "sidebar works!";

  displayRoutes : any[] = [];
  subMenusConfig:any = {};

  constructor(
      private _router: Router
  ) { }

  onToggleSidebar(): void {

    if( !this.sidebarLocked ){
      this.sidebarOpen = !this.sidebarOpen;
    }

    if( !this.sidebarOpen ){
      this.showAppDrawer = false;
    }
    // console.log("Desktop sidebarLocked ",  this.sidebarLocked );
    // console.log("Desktop sidebarOpen ",  this.sidebarOpen );
  }

  onLockSidebar(): void {
    this.sidebarLocked = !this.sidebarLocked;
    this.sidebarLockEvent.emit(this.sidebarLocked);

    if( this.sidebarLocked ){
      this.sidebarOpen = true;
    }
  }

  onToggleAppDrawer(): void {
    this.showAppDrawer = !this.showAppDrawer;
  }

  getSidebarLockIcon():any {
    return this.sidebarLocked ? 'fa fa-stop-circle-o' : 'fa fa-circle-o';
  }

  isSidebarLocked() {
    return this.sidebarLocked ? 'router-container sidebar-locked' : 'router-container';
  }

  sidebarItemClicked(route, childRoute){

    // console.log("sidebarItemClicked : ", route);

    if(!childRoute){
      if(!route.hasChildren){
        this._router.navigateByUrl(route.path);
      }else{
        // console.log("submenuconfig before", this.subMenusConfig[route.path]);
        this.subMenusConfig[route.path] = !(this.subMenusConfig[route.path]);
        // console.log("submenuconfig after", this.subMenusConfig[route.path]);
      }
    }else{
      this._router.navigateByUrl(route.path + "/" + childRoute.path);
    }

  }

  ngOnInit(): void {

    let routes = this._router.config;
    let currentRoute = this._router.routerState.snapshot.root;
    let appRoutes:any[] = [];

    // console.log("test", routes);

    routes.forEach( value => {

      let routeMetaData:any = value.data;
      let routeConfig:any = {};

      if(routeMetaData){

        if(routeMetaData.createSidebarEntry){
          // console.log("Route Checking : ", routeMetaData , value);
          routeConfig = {
            path : value.path,
            order : routeMetaData.order || 99,
            icon : routeMetaData.pathIcon,
            display : routeMetaData.pathDisplayText,
            // component : value.component,
            hasChildren : false
          };

          if(value.children){

            let childRoutes:any[] = [];

            value.children.forEach( childValue => {

              let childRouteMetaData:any = childValue.data;
              let childRouteConfig:any = {};

              // console.log("Hey Justin : ",childRouteMetaData);

              if(childRouteMetaData.createSidebarEntry){

                childRouteConfig = {
                  path : childValue.path,
                  order : childRouteMetaData.order || 99,
                  icon : childRouteMetaData.pathIcon,
                  display : childRouteMetaData.pathDisplayText,
                  // component : childValue.component
                };
                childRoutes.push(childRouteConfig);

              }
            });

            if(childRoutes.length > 0){
              routeConfig.hasChildren = true;
              routeConfig.children = childRoutes;
              this.subMenusConfig[value.path] = false;
            }
          }
        }
        // console.log("route config", routeConfig);
        appRoutes.push(routeConfig);

      }
    });
    this.displayRoutes = _.sortBy(appRoutes, "order");
    // console.log(this.displayRoutes);
    // console.log("subMenusConfig",this.subMenusConfig);
  }

}
