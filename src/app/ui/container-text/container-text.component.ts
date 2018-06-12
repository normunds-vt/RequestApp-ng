import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'container-text',
  templateUrl: './container-text.component.html',
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerTextComponent)}],
})
export class ContainerTextComponent extends ContainerComponent
                                    implements OnInit, OnDestroy {

  @Input() istextarea: boolean | string;
  @Input() isnumeric: boolean | string;
  @Input() isshort: boolean | string;
  @Input() iscentered: boolean | string;

  @Input() placeholder = '';

  @Input() validateWith: Function;

  value = {
    text: '',
    valid: false,
    required: false,
  };

  // stream to debounce text entries
  textStream$: Subject<string> = new Subject<string>();
  errorStr = '';

  ngOnInit() {
    this.textStream$
      .debounceTime(300)
      .subscribe(value => this.notifyChange());
  }

  valueChanged() {
    this.validateComponentValue();
    this.textStream$.next();
  }

  ngOnDestroy() {
    this.textStream$.complete();
  }

  validateComponentValue() {
    if (!this.isRequired) {
      this.value.valid = true;
      this.errorStr = '';
    } else if (this.validateWith !== undefined) {
      this.errorStr = this.validateWith(this.value.text);
      this.value.valid = (this.errorStr === '');
    } else {  // default validation
      this.value.valid = ('' + this.value.text).length > 3;
      this.errorStr = this.value.valid ? '' : 'value required';
    }
  }

  isOfType(typename) {
    return this[typename] !== undefined;
  }
}
