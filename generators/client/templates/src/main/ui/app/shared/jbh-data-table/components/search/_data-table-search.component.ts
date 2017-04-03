import { Component, Input } from '@angular/core';


@Component({
  selector: 'datatable-search',
  template: `
    <div class="typeahead">
      <datatable-typeahead-column *ngFor="let typeaheadcol of typeAheadColumns"
        [list]="list"
        [placeholder]="typeaheadcol.name ? 'Enter '+typeaheadcol.name: 'Enter '+typeaheadcol.prop"
        [searchProperty]="typeaheadcol.prop"
        [displayProperty]="typeaheadcol.prop">
        
      </datatable-typeahead-column>
        
     </div>
  `,
  styles: [`
    .typeahead {
     
    }
    `],
})
export class DataTableSearchComponent {
  abstract;

  /**
   * The complete list of items.
   */
  @Input() list:any[] = [];

  /**
   * The list of type ahead columns
   */
  @Input() typeAheadColumns:any[] = [];



}
