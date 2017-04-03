import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import {JbhTypeaheadComponent} from "./jbh-typeahead.component";

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [JbhTypeaheadComponent],
  exports: [JbhTypeaheadComponent]
})
export class JbhTypeaheadModule { }
