import {
  Component,
  Input,
  ContentChildren,
  QueryList
} from '@angular/core';

import { IdService } from '../id-service';
import { HDConfig } from '../../hd.config';
import { IValue } from './value.interface';
import { ContentService } from '../../services/content.service';


// this is abstract class but not implemented as such because of ng5 AOT compilation issue
@Component({
  template: ''
})
// this should be abstract class but AOT compilation as of ng5 does not appear to support abstract classes
// export abstract class ContainerComponent {
export class ContainerComponent {
  @Input() title: string;
  @Input() name: string;

  @Input()
    set required(value) { this.value.isrequired = value !== undefined; }

  // @Input() testValue = false;

  // @Input() radioSelectChild;

  path: string;
  value: IValue = { };  // generic override in each subclass

  // generate unique id for checkbox and label "for" attribute
  // it may be preferrable to use uuid utitly function for getting unique id
  dom_id = 'rid_' + this.idService.getId() + '_';

  @ContentChildren(ContainerComponent) children: QueryList<ContainerComponent>;

  constructor(
    public contentService: ContentService,
    public config: HDConfig,
    public idService: IdService // for component that needs unique dom id
  ) { }

  // should be called to propogate relevant component changes to the ContentService
  notifyChange() {
    this.validateComponentValue();
    this.contentService.updateItem(this.path, this.value);
  }

  // tslint:disable-next-line:semicolon // abstract method cannot have implementation;
  // because of AOT compilation issue cannot use this
  // abstract validateComponentValue()
  validateComponentValue() {
    throw new Error('Error: Cannot use abstract class');
  }

  applyNewValue(value) {
    Object.assign(this.value, value);
    this.postApply();
    this.validateComponentValue();
  }

  postApply() { /* to be implemented by child implementations if necessary */}

  get isRequired() { return !!this.value.isrequired; }
  get isValid() { return !!this.value.valid; }
}
