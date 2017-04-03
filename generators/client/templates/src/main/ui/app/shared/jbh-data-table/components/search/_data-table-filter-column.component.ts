import {Component, Input, Output, EventEmitter, ViewChild, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {Http, Response}   from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const noop = () => {
};


@Component({
  selector: 'datatable-filter-column',
  template: `
     <div class="panel-group" id="accordion">
      <div class="panel panel-default">
        <div class="panel-heading" (click)="showOrHideFilters()">
          {{getTitle()}} ({{this._filterValues.length}})
          <i class="pull-right glyphicon"
              [ngClass]="{
                'glyphicon-chevron-down':!isOpen,
                'glyphicon-chevron-up':isOpen
              }">
          </i>
            <!--<label -->
                <!--class="accordion-toggle" -->
                <!--data-toggle="collapse" -->
                <!--data-parent="#accordion" -->
                <!--href="#collapseOne"> {{getTitle()}} ({{this._filterValues.length}}) </label>-->
        </div>
       <div id="collapseOne" class="panel-collapse collapse in">
        <div class="panel-body" [hidden]="!(isOpen)">
          <table class="table">
            <tr>
              <input type="text" [(ngModel)]="searchInput" (keyup)="search($event)" class="form-control"  placeholder="search" /><br/>
            </tr>
            <tr *ngFor="let filterField of _filterValues">
              <td>
                <input type="checkbox" [(ngModel)]="filterField.checked" (change)="filter($event)" />
                <label>{{filterField.value}}</label>
              </td>
            </tr>
            <tr >
              <td>
                <span class="underline">
                  <a (click)="reset()">Reset</a>
                </span>
              </td>
             </tr>
           </table>
          </div>
         </div>
        </div>
       </div>
 `,
  styles: [`
    .panel-group{
      margin-bottom:0px;
    }
    `],
})
export class DataTableFilterColumnComponent {

  private isOpen: boolean = false;
  private _rows: any[] = [];
  private _searchProperty: string;
  private _displayProperty: string;
  private title:string;
  private emptyMessage = "(empty)";

  private _filterValues:any[] = [];
  private _filterValuesCache:any[] = [];
  private searchInput:string = '';

  @Input() set rows(val: any[]) {
    this._rows = val;
    this.initializeFilterValues();
  }

  getTitle(){
    return this._displayProperty ? this._displayProperty: this._searchProperty;
  }
  get rows(): any[] {
    return this._rows;
  }

  @Output() onFilterChange = new EventEmitter<any>();

  reset(){
    //set all checkboxes to selected
    for(let i=0;i< this._filterValues.length;i++){
      this._filterValues[i]['checked']=true;
    }

    this._filterValuesCache=this._filterValues;

    this.onFilterChange.emit({columnName:this._searchProperty,unSelectedValues:this.getUnselectedValues()});
  }

  search(){
    let input =this.searchInput;
    this._filterValues = this._filterValuesCache.filter(function (item) {
      return item['value'] == null || item['value'].toString().toLowerCase().indexOf(input.toLowerCase()) > -1;
    });
  }

  getUnselectedValues(){
    let values = [];
    for(let i=0;i<this._filterValues.length;i++){
      if(this._filterValues[i]['checked']  === false){
        values.push(this._filterValues[i]['value']);
      }
    }
    return values;
    // return this._filterValues.filter((item) => item.checked === false);
  }

  filter(e){
    this.onFilterChange.emit({columnName:this._searchProperty,unSelectedValues:this.getUnselectedValues()});
  }

  /**
   * The property of a list item that should be used for matching.
   */
  @Input() set searchProperty(val: string) {
    this._searchProperty = val;
    this.initializeFilterValues();
  }

  get searchProperty(): string {
    return this._searchProperty;
  }

  private isDuplicateFilter(filter:any):boolean{
    if(filter == null || filter == ''){
      filter=this.emptyMessage;
    }

    for(let i=0;i<this._filterValues.length;i++){
      if(this._filterValues[i] && this._filterValues[i]['value'] && this._filterValues[i]['value'] == filter){
        return true;
      }
    }
    return false;
  }

  findUniqueValues():any[]{
    this._filterValues= [];
    if (this._rows == null || this._rows.length === 0) {
      return [];
    }else{
      for(let i=0;i<this._rows.length;i++){
        if(!this.isDuplicateFilter(this._rows[i][this._searchProperty])){
          if(this._rows[i][this._searchProperty] == null || this._rows[i][this._searchProperty] == ''){
            this._filterValues.push({value:this.emptyMessage, checked:true});
          }else{
            this._filterValues.push({value:this._rows[i][this._searchProperty], checked:true});
          }

        }
      }
    }

    this._filterValuesCache=this._filterValues;

    return this._filterValues;
  }

  private initializeFilterValues(){
    this.findUniqueValues();
  }

  /**
   * The property of a list item that should be used for matching.
   */
  @Input() set displayProperty(val: string) {
    this._displayProperty = val;
  }

  get displayProperty(): string {
    return this._displayProperty;
  }

  private showOrHideFilters(){
    this.isOpen = !(this.isOpen);
  }

}
