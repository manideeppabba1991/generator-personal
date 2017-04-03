import {
  Component, Input, Output, ElementRef, EventEmitter, ViewChild,
  HostListener, ContentChildren, OnInit, QueryList, AfterViewInit,
  HostBinding, ContentChild, TemplateRef, IterableDiffer,
  DoCheck, KeyValueDiffers, ViewEncapsulation, NgModule
} from '@angular/core';

import {
  forceFillColumnWidths, adjustColumnWidths, sortRows, scrollbarWidth,
  setColumnDefaults, throttleable, translateTemplates
} from '../utils';
import { ColumnMode, SortType, SelectionType } from '../types';
import { DataTableBodyComponent } from './body';
import { DataTableColumnDirective } from './columns';
import { DatatableRowDetailDirective } from './row-detail';
import { DataTableSearchComponent } from './search/data-table-search.component';

@Component({
  selector: 'jbh-data-table',
  templateUrl: './jbh-data-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./jbh-data-table.component.scss','../themes/icons.scss'],
  host: {
    class: 'jbh-data-table'
  }
})
export class JBHDataTableComponent implements OnInit, AfterViewInit, DoCheck {

  /**
   * Advanced Filter and Detail View .
   *
   * @memberOf JBHDataTableComponent
   */
  isDataTableFilterOpen: boolean = false;
  isDataTableDetailOpen: boolean = false;

  rowsCache = [];
  unselectedColumnAndValuesList = [];

  private replaceFilterColumnValue(columnNameAndValues:any){
    for(let columnsIndex=0; columnsIndex<this.unselectedColumnAndValuesList.length;columnsIndex++){
      if(this.unselectedColumnAndValuesList[columnsIndex].columnName == columnNameAndValues.columnName){
        this.unselectedColumnAndValuesList.splice(columnsIndex,1);
        break;
      }
    }
    this.unselectedColumnAndValuesList.push(columnNameAndValues);
  }

  private onFilterChange(columnNameAndValues:any ){
    this.replaceFilterColumnValue(columnNameAndValues);

      let tempRows =this.rowsCache;
      for(let columnsIndex=0; columnsIndex<this.unselectedColumnAndValuesList.length;columnsIndex++){
        let columnName = this.unselectedColumnAndValuesList[columnsIndex].columnName;
        let unSelectedColumnValues = this.unselectedColumnAndValuesList[columnsIndex].unSelectedValues;
        if(unSelectedColumnValues && unSelectedColumnValues.length>0){
          for(let index=0; index<unSelectedColumnValues.length; index++){
            let columnValue = unSelectedColumnValues[index];
            tempRows=( tempRows.filter(function(item) {
              if(columnValue == '(empty)'){
                return item[columnName] != null;
              }else{
                return   item[columnName] != columnValue;
              }
            }));
          }
        }
      }

    // update the rows
      this._rows = tempRows;
    // Whenever the filter changes, always go back to the first page
    this.offset = 0;
  }


  toggleDataTableFilter(){
    if( this.isDataTableDetailOpen === true ){
      this.isDataTableDetailOpen = false;
    }
    this.isDataTableFilterOpen = !this.isDataTableFilterOpen;

    // this.recalculateColumns();

    console.log(" isDataTableFilterOpen = false " + this.isDataTableFilterOpen);

  }

  toggleDataTableDetail(){
    if( this.isDataTableFilterOpen = true ){
      this.isDataTableFilterOpen = false;
    }
    this.isDataTableDetailOpen = !this.isDataTableDetailOpen;
    console.log(" isDataTableDetailOpen = false " + this.isDataTableDetailOpen);
  }

  // @Input typeAheadServiceDetails:string = '';

  // @Output() onTypeAheadLookup: EventEmitter<any> = new EventEmitter();
  //
  // @Input typeAheadSuggestionsList:any[];

  /**
   * Rows that are displayed in the table.
   *
   * @memberOf JBHDataTableComponent
   */
  @Input() set rows(val: any) {
    this.setRows(val);
  }

  /**
   * If the table should display custom top menu
   *
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  @Input() externalMenu: any[];

  /**
   * External menu were clicked.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() menuselect: EventEmitter<any> = new EventEmitter();

  filterChangeInProgress:boolean = false;

  private setRows(val: any){
    // auto sort on new updates
    if (!this.externalSorting) {
      val = sortRows(val, this.columns, this.sorts);
    }

    this._rows = val;

    //if(!this.filterChangeInProgress){
    //  console.log('updating cache')
      // cache our list
      this.rowsCache = [...val];
    //}

    // recalculate sizes/etc
    this.recalculate();
  }

  /**
   * Gets the rows.
   *
   * @readonly
   * @type {*}
   * @memberOf JBHDataTableComponent
   */
  get rows(): any {
    return this._rows;
  }

  /**
   * Columns to be displayed.
   *
   * @memberOf JBHDataTableComponent
   */
  @Input() set columns(val: any[]) {
    if(val) {
      setColumnDefaults(val);
      this.recalculateColumns(val);
    }

    this._columns = val;
  }

  /**
   * Get the columns.
   *
   * @readonly
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  get columns(): any[] {
    return this._columns;
  }

  /**
   * Typeahead columns to be displayed in search bar
   *
   * @memberOf JBHDataTableComponent
   */
  @Input() set typeAheadColumns(val: any[]) {

    this._typeAheadColumns = val;
  }

  /**
   * Get the type ahead columns .
   *
   * @readonly
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  get typeAheadColumns(): any[] {
    return this._typeAheadColumns;
  }

  /**
   * Filter columns to be displayed in fitlers
   *
   * @memberOf JBHDataTableComponent
   */
  @Input() set filterColumns(val: any[]) {
    if(val){
      this.isDataTableFilterOpen=true;
    }
    this._filterColumns = val;
  }

  /**
   * Get the filter columns .
   *
   * @readonly
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  get filterColumns(): any[] {
    return this._filterColumns;
  }

  @Input() set typeAheadSuggestionService(val: string){
    this._typeAheadSuggestionService = val;
  }

  get typeAheadSuggestionService(): string {
    return this._typeAheadSuggestionService;
  }

  @Input() set typeAheadSearchService(val: string){
    this._typeAheadSearchService=val;
  }

  get typeAheadSearchService():string {
    return this._typeAheadSearchService;
  }

  /**
   * List of row objects that should be
   * represented as selected in the grid.
   * Default value: `[]`
   *
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  @Input() selected: any[] = [];

  /**
   * Enable vertical scrollbars
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() scrollbarV: boolean = false;

  /**
   * Enable horz scrollbars
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() scrollbarH: boolean = false;

  /**
   * The row height; which is necessary
   * to calculate the height for the lazy rendering.
   *
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  @Input() rowHeight: number = 30;

  /**
   * Type of column width distribution formula.
   * Example: flex, force, standard
   *
   * @type {ColumnMode}
   * @memberOf JBHDataTableComponent
   */
  @Input() columnMode: ColumnMode = ColumnMode.standard;

  /**
   * The minimum header height in pixels.
   * Pass a falsey for no header
   *
   * @type {*}
   * @memberOf JBHDataTableComponent
   */
  @Input() headerHeight: any = 30;

  /**
   * The minimum footer height in pixels.
   * Pass falsey for no footer
   *
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  @Input() footerHeight: number = 0;

  /**
   * If the table should use external paging
   * otherwise its assumed that all data is preloaded.
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() externalPaging: boolean = false;

  /**
   * If the table should use external sorting or
   * the built-in basic sorting.
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() externalSorting: boolean = false;

  /**
   * The page size to be shown.
   * Default value: `undefined`
   *
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  @Input() limit: number = undefined;

  /**
   * The total count of all rows.
   * Default value: `0`
   *
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  @Input() set count(val: number) {
    this._count = val;

    // recalculate sizes/etc
    this.recalculate();
  }

  /**
   * Gets the count.
   *
   * @readonly
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  get count(): number {
    return this._count;
  }

  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`
   *
   * @type {number}
   * @memberOf JBHDataTableComponent
   */
  @Input() offset: number = 0;

  /**
   * Show the linear loading bar.
   * Default value: `false`
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() loadingIndicator: boolean = false;

  /**
   * Type of row selection. Options are:
   *
   *  - `single`
   *  - `multi`
   *  - `chkbox`
   *  - `multiClick`
   *  - `cell`
   *
   * For no selection pass a `falsey`.
   * Default value: `undefined`
   *
   * @type {SelectionType}
   * @memberOf JBHDataTableComponent
   */
  @Input() selectionType: SelectionType;

  /**
   * Enable/Disable ability to re-order columns
   * by dragging them.
   *
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @Input() reorderable: boolean = true;

  /**
   * The type of sorting
   *
   * @type {SortType}
   * @memberOf JBHDataTableComponent
   */
  @Input() sortType: SortType = SortType.single;

  /**
   * Array of sorted columns by property and type.
   * Default value: `[]`
   *
   * @type {any[]}
   * @memberOf JBHDataTableComponent
   */
  @Input() sorts: any[] = [];

  /**
   * Css class overrides
   *
   * @type {*}
   * @memberOf JBHDataTableComponent
   */
  @Input() cssClasses: any = {
    sortAscending: 'icon icon-arrow-down',
    sortDescending: 'icon icon-arrow-up',
    pagerLeftArrow: 'icon icon-arrow-left',
    pagerRightArrow: 'icon icon-arrow-right',
    pagerPrevious: 'icon icon-arrow-lef==',
    pagerNext: 'icon-skip'
  };

  /**
   * Message overrides for localization
   *
   * emptyMessage     [default] = 'No data to display'
   * totalMessage     [default] = 'total'
   * selectedMessage  [default] = 'selected'
   *
   * @type {*}
   * @memberOf JBHDataTableComponent
   */
  @Input() messages: any = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'No data to display',

    // Footer total message
    totalMessage: 'total',

    // Footer selected message
    selectedMessage: 'selected'
  };

  /**
   * This will be used when displaying or selecting rows.
   * when tracking/comparing them, we'll use the value of this fn,
   *
   * (`fn(x) === fn(y)` instead of `x === y`)
   *
   * @memberOf JBHDataTableComponent
   */
  @Input() rowIdentity: (x: any) => any = ((x: any) => x);

  /**
   * A boolean/function you can use to check whether you want
   * to select a particular row based on a criteria. Example:
   *
   *    (selection) => {
   *      return selection !== 'Ethel Price';
   *    }
   *
   * @type {*}
   * @memberOf JBHDataTableComponent
   */
  @Input() selectCheck: any;

  @Input() title: string = '';

  /**
   * Property to which you can use for custom tracking of rows.
   * Example: 'name'
   *
   * @type {string}
   * @memberOf JBHDataTableComponent
   */
  @Input() trackByProp: string;

  /**
   * Body was scrolled typically in a `scrollbarV:true` scenario.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() scroll: EventEmitter<any> = new EventEmitter();

  /**
   * A cell or row was focused via keyboard or mouse click.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() activate: EventEmitter<any> = new EventEmitter();

  /**
   * A cell or row was selected.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  /**
   * Column sort was invoked.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() sort: EventEmitter<any> = new EventEmitter();

  /**
   * The table was paged either triggered by the pager or the body scroll.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() page: EventEmitter<any> = new EventEmitter();

  /**
   * Columns were re-ordered.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() reorder: EventEmitter<any> = new EventEmitter();

  /**
   * Column was resized.
   *
   * @type {EventEmitter<any>}
   * @memberOf JBHDataTableComponent
   */
  @Output() resize: EventEmitter<any> = new EventEmitter();

  /**
   * The context menu was invoked on a row.
   *
   * @memberOf JBHDataTableComponent
   */
  @Output() rowContextmenu = new EventEmitter<{ event: MouseEvent, row: any }>(false);

  /**
   * CSS class applied if the header height if fixed height.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.fixed-header')
  get isFixedHeader(): boolean {
    const headerHeight: number | string = this.headerHeight;
    return (typeof headerHeight === 'string') ?
      (<string>headerHeight) !== 'auto' : true;
  }

  /**
   * CSS class applied to the root element if
   * the row heights are fixed heights.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.fixed-row')
  get isFixedRow(): boolean {
    const rowHeight: number | string = this.rowHeight;
    return (typeof rowHeight === 'string') ?
      (<string>rowHeight) !== 'auto' : true;
  }

  /**
   * CSS class applied to root element if
   * vertical scrolling is enabled.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.scroll-vertical')
  get isVertScroll(): boolean {
    return this.scrollbarV;
  }

  /**
   * CSS class applied to the root element
   * if the horziontal scrolling is enabled.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.scroll-horz')
  get isHorScroll(): boolean {
    return this.scrollbarH;
  }

  /**
   * CSS class applied to root element is selectable.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.selectable')
  get isSelectable(): boolean {
    return this.selectionType !== undefined;
  }

  /**
   * CSS class applied to root is checkbox selection.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.checkbox-selection')
  get isCheckboxSelection(): boolean {
    return this.selectionType === SelectionType.checkbox;
  }

  /**
   * CSS class applied to root if cell selection.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.cell-selection')
  get isCellSelection(): boolean {
    return this.selectionType === SelectionType.cell;
  }

  /**
   * CSS class applied to root if single select.
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.single-selection')
  get isSingleSelection(): boolean {
    return this.selectionType === SelectionType.single;
  }

  /**
   * CSS class added to root element if mulit select
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.multi-selection')
  get isMultiSelection(): boolean {
    return this.selectionType === SelectionType.multi;
  }

  /**
   * CSS class added to root element if mulit click select
   *
   * @readonly
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  @HostBinding('class.multi-click-selection')
  get isMultiClickSelection(): boolean {
    return this.selectionType === SelectionType.multiClick;
  }

  /**
   * Column templates gathered from `ContentChildren`
   * if described in your markup.
   *
   * @memberOf JBHDataTableComponent
   */
  @ContentChildren(DataTableColumnDirective)
  set columnTemplates(val: QueryList<DataTableColumnDirective>) {
    this._columnTemplates = val;

    if (val) {
      // only set this if results were brought back
      const arr = val.toArray();

      if (arr.length) {
        // translate them to normal objects
        this.columns = translateTemplates(arr);
      }
    }
  }

  /**
   * Returns the column templates.
   *
   * @readonly
   * @type {QueryList<DataTableColumnDirective>}
   * @memberOf JBHDataTableComponent
   */
  get columnTemplates(): QueryList<DataTableColumnDirective> {
    return this._columnTemplates;
  }

  /**
   * Row Detail templates gathered from the ContentChild
   *
   * @memberOf JBHDataTableComponent
   */
  @ContentChild(DatatableRowDetailDirective)
  rowDetail: DatatableRowDetailDirective;

  /**
   * Reference to the body component for manually
   * invoking functions on the body.
   *
   * @private
   * @type {DataTableBodyComponent}
   * @memberOf JBHDataTableComponent
   */
  @ViewChild(DataTableBodyComponent)
  bodyComponent: DataTableBodyComponent;

  /**
   * Returns if all rows are selected.
   *
   * @readonly
   * @private
   * @type {boolean}
   * @memberOf JBHDataTableComponent
   */
  get allRowsSelected(): boolean {
    return this.selected &&
      this.rows &&
      this.selected.length === this.rows.length;
  }

  element: HTMLElement;
  innerWidth: number;
  pageSize: number;
  bodyHeight: number;
  rowCount: number;
  offsetX: number = 0;
  rowDiffer: IterableDiffer;
  _count: number = 0;
  _rows: any[];
  _columns: any[];
  _typeAheadColumns: any[];
  _filterColumns: any[];
  _typeAheadSuggestionService: string;
  _typeAheadSearchService: string;
  _columnTemplates: QueryList<DataTableColumnDirective>;

  constructor(element: ElementRef, differs: KeyValueDiffers) {
    // get ref to elm for measuring
    this.element = element.nativeElement;
    this.rowDiffer = differs.find({}).create(null);
  }

  onTypeAheadSearch(searchResult:any[]){
    console.log('In onTypeAheadSearch. row count:'+searchResult.length);
    //this._rows = searchResult;
    this.setRows(searchResult);
  }
  /**
   * Lifecycle hook that is called after data-bound
   * properties of a directive are initialized.
   *
   * @memberOf JBHDataTableComponent
   */
  ngOnInit(): void {
    // need to call this immediatly to size
    // if the table is hidden the visibility
    // listener will invoke this itself upon show
    this.recalculate();
  }

  /**
   * Lifecycle hook that is called after a component's
   * view has been fully initialized.
   *
   * @memberOf JBHDataTableComponent
   */
  ngAfterViewInit(): void {
    if (!this.externalSorting) {
      let val = sortRows(this._rows, this.columns, this.sorts);
      this._rows = val;
    }

    // this has to be done to prevent the change detection
    // tree from freaking out because we are readjusting
    setTimeout(() => this.recalculate());
  }

  /**
   * Lifecycle hook that is called when Angular dirty checks a directive.
   *
   * @memberOf JBHDataTableComponent
   */
  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      this.recalculatePages();
    }
  }

  /**
   * Recalc's the sizes of the grid.
   *
   * Updated automatically on changes to:
   *
   *  - Columns
   *  - Rows
   *  - Paging related
   *
   * Also can be manually invoked or upon window resize.
   *
   * @memberOf JBHDataTableComponent
   */
  recalculate(): void {
    this.recalculateDims();
    this.recalculateColumns();
  }

  /**
   * Window resize handler to update sizes.
   *
   * @memberOf JBHDataTableComponent
   */
  @HostListener('window:resize')
  @throttleable(5)
  onWindowResize(): void {
    this.recalculate();
  }

  /**
   * Recalulcates the column widths based on column width
   * distribution mode and scrollbar offsets.
   *
   * @param {any[]} [columns=this.columns]
   * @param {number} [forceIdx=false]
   * @param {boolean} [allowBleed=this.scrollH]
   * @returns {any[]}
   *
   * @memberOf JBHDataTableComponent
   */
  recalculateColumns(columns: any[] = this.columns,
                     forceIdx: number = -1,
                     allowBleed: boolean = this.scrollbarH): any[] {

    if (!columns) return;

    let width = this.innerWidth;
    if (this.scrollbarV) {
      width = width - scrollbarWidth;
    }

    if (this.columnMode === ColumnMode.force) {
      forceFillColumnWidths(columns, width, forceIdx, allowBleed);
    } else if (this.columnMode === ColumnMode.flex) {
      adjustColumnWidths(columns, width);
    }

    return columns;
  }

  /**
   * Recalculates the dimensions of the table size.
   * Internally calls the page size and row count calcs too.
   *
   * @memberOf JBHDataTableComponent
   */
  recalculateDims(): void {
    let {height, width} = this.element.getBoundingClientRect();
    this.innerWidth = Math.floor(width);

    if (this.scrollbarV) {
      if (this.headerHeight) height = height - this.headerHeight;
      if (this.footerHeight) height = height - this.footerHeight;
      this.bodyHeight = height;
    }

    this.recalculatePages();
  }

  /**
   * Recalculates the pages after a update.
   *
   *
   * @memberOf JBHDataTableComponent
   */
  recalculatePages(): void {
    this.pageSize = this.calcPageSize();
    this.rowCount = this.calcRowCount();
  }

  /**
   * Body triggered a page event.
   *
   * @param {*} { offset }
   *
   * @memberOf JBHDataTableComponent
   */
  onBodyPage({offset}: any): void {
    this.offset = offset;

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset
    });
  }

  /**
   * The body triggered a scroll event.
   *
   * @param {MouseEvent} event
   *
   * @memberOf JBHDataTableComponent
   */
  onBodyScroll(event: MouseEvent): void {
    this.offsetX = event.offsetX;
    this.scroll.emit(event);
  }

  /**
   * The footer triggered a page event.
   *
   * @param {*} event
   *
   * @memberOf JBHDataTableComponent
   */
  onFooterPage(event: any) {
    this.offset = event.page - 1;
    this.bodyComponent.updateOffsetY(this.offset);

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset
    });
  }

  /**
   * Recalculates the sizes of the page
   *
   * @param {any[]} [val=this.rows]
   * @returns {number}
   *
   * @memberOf JBHDataTableComponent
   */
  calcPageSize(val: any[] = this.rows): number {
    // Keep the page size constant even if the row has been expanded.
    // This is because an expanded row is still considered to be a child of
    // the original row.  Hence calculation would use rowHeight only.
    if (this.scrollbarV) {
      const size = Math.ceil(this.bodyHeight / this.rowHeight);
      return Math.max(size, 0);
    }

    // if limit is passed, we are paging
    if (this.limit !== undefined) return this.limit;

    // otherwise use row length
    if (val) return val.length;

    // other empty :(
    return 0;
  }

  /**
   * Calculates the row count.
   *
   * @param {any[]} [val=this.rows]
   * @returns {number}
   *
   * @memberOf JBHDataTableComponent
   */
  calcRowCount(val: any[] = this.rows): number {
    if (!this.externalPaging) {
      if (!val) return 0;
      return val.length;
    }

    return this.count;
  }

  /**
   * The header triggered a column resize event.
   *
   * @param {*} { column, newValue }
   *
   * @memberOf JBHDataTableComponent
   */
  onColumnResize({column, newValue}: any): void {
    /* Safari/iOS 10.2 workaround */
    if (column === undefined) {
      return;
    }
    let idx: number;
    let cols = this.columns.map((c, i) => {
      c = Object.assign({}, c);

      if (c.$$id === column.$$id) {
        idx = i;
        c.width = newValue;

        // set this so we can force the column
        // width distribution to be to this value
        c.$$oldWidth = newValue;
      }

      return c;
    });

    this.recalculateColumns(cols, idx);
    this._columns = cols;

    this.resize.emit({
      column,
      newValue
    });
  }

  /**
   * The header triggered a column re-order event.
   *
   * @param {*} { column, newValue, prevValue }
   *
   * @memberOf JBHDataTableComponent
   */
  onColumnReorder({column, newValue, prevValue}: any): void {
    let cols = this.columns.map(c => {
      return Object.assign({}, c);
    });

    cols.splice(prevValue, 1);
    cols.splice(newValue, 0, column);
    this.columns = cols;

    this.reorder.emit({
      column,
      newValue,
      prevValue
    });
  }

  /**
   * The header triggered a column sort event.
   *
   * @param {*} event
   *
   * @memberOf JBHDataTableComponent
   */
  onColumnSort(event: any): void {
    const {sorts} = event;

    // this could be optimized better since it will resort
    // the rows again on the 'push' detection...
    if (this.externalSorting === false) {
      // don't use normal setter so we don't resort
      this._rows = sortRows(this.rows, this.columns, sorts);
    }

    this.sorts = sorts;
    this.bodyComponent.updateOffsetY(0);
    this.sort.emit(event);
  }

  /**
   * Toggle all row selection
   *
   * @param {*} event
   *
   * @memberOf JBHDataTableComponent
   */
  onHeaderSelect(event: any): void {
    // before we splice, chk if we currently have all selected
    const allSelected = this.selected.length === this.rows.length;

    // remove all existing either way
    this.selected.splice(0, this.selected.length);

    // do the opposite here
    if (!allSelected) {
      this.selected.push(...this.rows);
    }

    this.select.emit({
      selected: this.selected
    });
  }

  /**
   * A row was selected from body
   *
   * @param {*} event
   *
   * @memberOf JBHDataTableComponent
   */
  onBodySelect(event: any): void {
    this.select.emit(event);
  }

}
