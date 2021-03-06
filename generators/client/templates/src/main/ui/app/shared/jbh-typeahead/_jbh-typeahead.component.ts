import { Component, Input, Output, EventEmitter, ViewChild, OnInit, forwardRef  } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Http, Response }   from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const noop = () => {
};


@Component({
  selector: 'jbh-typeahead',
  templateUrl: './jbh-typeahead.component.html',
  styleUrls: ['./jbh-typeahead.component.scss']
})
export class JbhTypeaheadComponent implements OnInit, ControlValueAccessor {
  abstract;

  constructor (private http: Http) {}

  private findSuggestions(): any {
    this.onLookup.emit(this.input);
  }

  _list:any[] = [];

  @Input() set list(val: any[]) {
    this.setRows(val);
  }

  private setRows(val: any[]) {
    this._list = val;
    if (this.onLookup) {
      this.suggestions = val;
      this.displaySuggestions();
    }
  }

  //Width in Pixels
  @Input() width:number = 500;


  /**
   * Input element placeholder text.
   */
  @Input() placeholder:string = '';

  @Input() lookupService:string = '';

  @Input() searchService:string = '';

  /**
   * The property of a list item that should be used for matching.
   */
  @Input() searchProperty:string = '';

  /**
   * The property of a list item that should be displayed.
   */
  @Input() displayProperty:string = '';

  /**
   * The maximum number of suggestions to display.
   */
  @Input() maxSuggestions:number = -1;


  @Output() onSelected = new EventEmitter<any[]>();

  /**
   * Event that occurs when a suggestion is selected.
   */
  @Output() suggestionSelected = new EventEmitter<any>();

  /**
   * Event that occurs when a key pressed
   */
  @Output() onLookup = new EventEmitter<any>();

  @Output() onSearch = new EventEmitter<any>();

  /**
   * Handle to the input element.
   */
  @ViewChild('inputElement') private inputElement:any;

  /**
   * The input element's value.
   */
  private input:string;

  /**
   * The typeahead element's value. This element is displayed behind the input element.
   */
  private typeahead:string;

  private isSugestionSelected: boolean = false;

  /**
   * The previously entered input string.
   */
  private previousInput:string;

  /**
   * The filtered list of suggestions.
   */
  private suggestions:any[] = [];

  /**
   * Indicates whether the suggestions are visible.
   */
  private areSuggestionsVisible:boolean = false;

  /**
   * The currently selected suggestion.
   */
  private selectedSuggestion:any;

  /**
   * The active (highlighted) suggestion.
   */
  private activeSuggestion:any;

  /**
   * Indicates whether the control is disabled.
   */
  private isDisabled:boolean = false;

  /**
   * Implement this interface to execute custom initialization logic after your
   * directive's data-bound properties have been initialized.
   *
   * ngOnInit is called right after the directive's data-bound properties have
   * been checked for the first time, and before any of its
   * children have been checked. It is invoked only once when the directive is
   * instantiated.
   */
  public ngOnInit() {
  }

  /**
   * Placeholder for a callback which is later provided by the Control Value Accessor.
   */
  private onTouchedCallback:() => void = noop;

  /**
   * Placeholder for a callback which is later provided by the Control Value Accessor.
   */
  //private onChangeCallback:(_:any) => void = noop;

  /**
   * Get accessor.
   */
  get value():any {
    return this.selectedSuggestion;
  }

  /**
   * Set accessor including call the onchange callback.
   */
  set value(v:any) {
    if (v !== this.selectedSuggestion) {
      this.selectSuggestion(v);
      //this.onChangeCallback();
    }
  }

  /**
   * From ControlValueAccessor interface.
   */
  writeValue(value:any) {
    if (value !== this.selectedSuggestion) {
      this.selectSuggestion(value);
    }
  }

  /**
   * From ControlValueAccessor interface.
   */
  registerOnChange(fn:any) {
    //this.onChangeCallback = fn;
  }

  onSearchButtonClick(){
    this.onSearch.emit(this.input);
  }

  /**
   * From ControlValueAccessor interface.
   */
  registerOnTouched(fn:any) {
    this.onTouchedCallback = fn;
  }

  /**
   * Sets the disabled state of the control.
   * @param isDisabled
   */
  setDisabledState(isDisabled:boolean):void {
    this.isDisabled = isDisabled;
  }

  /**
   * Called when a keydown event is fired on the input element.
   */
  public inputKeyDown(event:KeyboardEvent) {
    if (event.which === 9 || event.keyCode === 9) { // TAB
      // Only enter this branch if suggestions are displayed
      if (!this.areSuggestionsVisible) {
        return;
      }

      // Remove all but the first suggestion
      //this.suggestions.splice(1);

      // Hide the suggestions
      this.areSuggestionsVisible = false;

      // Select the first suggestion
      //this.selectSuggestion(this.activeSuggestion);
      //this.suggestionSelected.emit(this.suggestions);

      event.preventDefault();
    } else if (event.which === 38 || event.keyCode === 38) { // UP
      // Find the active suggestion in the list
      let activeSuggestionIndex = this.getActiveSuggestionIndex();

      // If not found, then activate the first suggestion
      if (activeSuggestionIndex === -1) {
        this.setActiveSuggestion(this.suggestions[0]);
        return;
      }

      if (activeSuggestionIndex === 0) {
        // Go to the last suggestion
        this.setActiveSuggestion(this.suggestions[this.suggestions.length - 1]);
      } else {
        // Decrement the suggestion index
        this.setActiveSuggestion(this.suggestions[activeSuggestionIndex - 1]);
      }
    } else if (event.which === 40 || event.keyCode === 40) { // DOWN
      // Find the active suggestion in the list
      let activeSuggestionIndex = this.getActiveSuggestionIndex();

      // If not found, then activate the first suggestion
      if (activeSuggestionIndex === -1) {
        this.setActiveSuggestion(this.suggestions[0]);
        return;
      }

      if (activeSuggestionIndex === (this.suggestions.length - 1)) {
        // Go to the first suggestion
        this.setActiveSuggestion(this.suggestions[0]);
      } else {
        // Increment the suggestion index
        this.setActiveSuggestion(this.suggestions[activeSuggestionIndex + 1]);
      }
    } else if ((event.which === 10 || event.which === 13 ||
      event.keyCode === 10 || event.keyCode === 13) &&
      this.areSuggestionsVisible) { // ENTER
      // Select the active suggestion
      this.selectSuggestion(this.activeSuggestion);

      // Hide the suggestions
      this.areSuggestionsVisible = false;

      event.preventDefault();
    }
  }

  /**
   * Sets the active (highlighted) suggestion.
   */
  public setActiveSuggestion(suggestion:any) {
    this.activeSuggestion = suggestion;
    this.populateTypeahead();
  }

  /**
   * Gets the index of the active suggestion within the suggestions list.
   */
  public getActiveSuggestionIndex() {
    let activeSuggestionIndex = -1;
    if (this.activeSuggestion != null) {
      activeSuggestionIndex = this.indexOfObject(this.suggestions, this.searchProperty, this.activeSuggestion[this.searchProperty]);
    }
    return activeSuggestionIndex;
  }

  /**
   * Gets the index of an object in a list by matching a property value.
   */
  public indexOfObject(array:any[], property:string, value:string) {
    if (array == null || array.length === 0) return -1;
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i][property] != null && array[i][property] === value) {
        index = i;
      }
    }
    return index;
  }



  /**
   * Called when a keyup event is fired on the input element.
   */
  public inputKeyUp(event:KeyboardEvent) {
    // Ignore TAB, UP, and DOWN since they are processed by the keydown handler
    if (event.which === 9 || event.keyCode === 9 ||
      event.which === 38 || event.keyCode === 38 ||
      event.which === 40 || event.keyCode === 40) {
      return;
    }


    // When the input is cleared
    if (this.input == null || this.input.length === 0) {
      this.typeahead = '';
      this.populateSuggestions();
      return;
    }

    // If the suggestion matches the input, then return
    if (this.selectedSuggestion != null) {
      console.debug(`If the suggestion matches the input, then return`);
      if (this.deepValueGetter(this.selectedSuggestion, this.displayProperty ? this.displayProperty:this.searchProperty) === this.input) {
        return;
      }
    }

    // Repopulate the suggestions
    this.previousInput = this.input;
    this.populateSuggestions();
    this.populateTypeahead();
  }

  /**
   * Called when a focus event is fired on the input element.
   */
  public inputFocus(event:FocusEvent) {
    // If the element is receiving focus and it has a selection, then
    // clear the selection. This helps prevent partial editing
    // if (this.selectedSuggestion != null) {
    //   this.selectSuggestion(null);
    //   this.input = null;
    //   this.populateTypeahead();
    // }

    // Re-populate the suggestions
    this.populateSuggestions();

    // If we have suggestions
    if (this.suggestions.length > 0) {
      // Set the typeahead to a slice of the first suggestion
      this.populateTypeahead();

      // Show/hide the suggestions
      this.areSuggestionsVisible = this.suggestions.length > 0;
    }
  }

  /**
   * Called when a blur event is fired on the input element.
   */
  public inputBlur(event:Event) {
    this.typeahead = '';
    this.areSuggestionsVisible = false;
    this.onTouchedCallback();
  }

  /**
   * Called when a mouseover event is fired on a suggestion element.
   */
  public suggestionMouseOver(suggestion:any) {
    this.setActiveSuggestion(suggestion);
  }

  /**
   * Called when a mousedown event is fired on a suggestion element.
   */
  public suggestionMouseDown(suggestion:any) {
    //this.inputElement.nativeElement.value= (suggestion[this.displayProperty]);
    this.selectSuggestion(suggestion);
  }

  /**
   * Called when a mouseout event is fired on the suggestions element.
   */
  public suggestionsMouseOut(event:MouseEvent) {
    this.setActiveSuggestion(null);
  }

  /**
   * Fills the suggestions list with items matching the input pattern.
   */
  public populateSuggestions() {
    // Capture variables scoped to the component
    let searchProperty = this.searchProperty;
    let input = this.input;
    this.isSugestionSelected=false;

    // Confirm that we have a search property
    if (searchProperty == null || searchProperty.length === 0) {
      console.error('The input attribute `searchProperty` must be provided');
      return;
    }
    // Handle empty input
    if (input == null || input.length === 0) {
      // No input yet
      this.suggestions = [];
      this.areSuggestionsVisible = false;
      return;
    }

    if(this.onLookup){
      this.findSuggestions();
      return;
    }

    // Check that we have data
    if (this.list == null || this.list.length === 0) return;
    // Filter the suggestions
    this.suggestions = this._list.filter(function (item) {
      if(searchProperty){
        return item[searchProperty].toLowerCase().indexOf(input.toLowerCase()) > -1;
      }else{
        return true;
      }
    });


  }

  private displaySuggestions(){
    if(this.isSugestionSelected || this.suggestions.length<=0){
      return;
    }

    // Limit the suggestions (if applicable)
    if (this.maxSuggestions > -1 && this.suggestions.length>this.maxSuggestions) {
      this.suggestions = this.suggestions.slice(0, this.maxSuggestions);
    }

    if (this.suggestions.length === 0) {
      // No suggestions, so clear the typeahead
      this.typeahead = '';
    } else {
      // Set the typeahead value
      this.populateTypeahead();
      // Make the first suggestion active
      this.activeSuggestion = this.suggestions[0];
    }

    // Show/hide the suggestions
    this.areSuggestionsVisible = this.suggestions.length > 0;

    //Notify to parent component
    this.suggestionSelected.emit(this.suggestions);
  }

  /**
   * Sets the typeahead input element's value based on the active suggestion.
   */
  public populateTypeahead() {

    // Clear the typeahead when there is no active suggestion
    if (this.activeSuggestion == null || !this.areSuggestionsVisible) {
      this.typeahead = '';
      return;
    }

    // Set the typeahead value
    this.typeahead = this.input + (this.deepValueGetter(this.activeSuggestion, this.displayProperty ? this.displayProperty:this.searchProperty).toString() || '').slice(this.input.length);
    //this.typeahead = (this.activeSuggestion[this.displayProperty] || '');
  }

  /**
   * Selects a suggestion.
   */
  public selectSuggestion(suggestion:any) {
    // Set the variable
    this.selectedSuggestion = suggestion;

    // Hide the suggestions
    this.areSuggestionsVisible = false;

    // Other form operations
    if (this.selectedSuggestion != null) {
      // Set the values of the input elements
      this.input = this.deepValueGetter(suggestion, this.displayProperty ? this.displayProperty:this.searchProperty).toString();
      this.typeahead = this.deepValueGetter(suggestion, this.displayProperty ? this.displayProperty:this.searchProperty).toString();

      // Blur the input so we can "lock" the selected suggestion
      this.blurInputElement();
      this.isSugestionSelected=true;
      this.findSuggestions();
    }
  }

  /**
   * Blurs the input element in order to "lock" the value and prevent partial editing.
   */
  public blurInputElement() {
    if (this.inputElement && this.inputElement.nativeElement) {
      this.inputElement.nativeElement.blur();
    }
  }

  /**
   * Indicates whether a suggestion has been selected.
   */
  public hasSelection() {
    return this.selectedSuggestion != null;
  }

  deepValueGetter(obj: Object, path: string) {
  if(!obj || !path) return obj;

  let current = obj;
  let split = path.split('.');

  if(split.length) {
    for(let i = 0, len = split.length; i < len; i++) {
      current = current[split[i]];

      // if found undefined, return empty string
      if(current === undefined || current === null) return '';
    }
  }

  return current;
}

}

