import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import * as dateFormat from 'dateformat';
import { IValue } from '../container/value.interface';

import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'container-dt',
  templateUrl: './container-dt.component.html',
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerDtComponent)
  }],
})
export class ContainerDtComponent
  extends ContainerComponent
  implements OnInit {
  value = {
    date: null,
    valid: false
  };
  dateformat: string;
  dateformatPrime: string;
  disabledDays = [];
  placeholder: string;

  ngOnInit() {
    this.dateformat = this.config.dateformat || 'mm/dd/yyyy';
    this.dateformatPrime = this.dateformat.replace(/yyyy/, 'yy');
    this.disabledDays = this.config.disabledDays;
    this.placeholder = this.dateformat.toUpperCase();
  }

  onchange(value) {
    this.value.date = value
      ? dateFormat(value, this.dateformat)
      : '';
    this.notifyChange();
  }

  validateComponentValue() {
    this.value.valid = !!this.value.date;
  }
}
