import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
// import { Subject } from 'rxjs/Subject';
// import 'rxjs/add/operator/debounceTime';
// import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: 'container-list',
  templateUrl: './container-list.component.html',
  // styleUrls: ['./container-text.component.scss'],
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerListComponent)}],
})
export class ContainerListComponent extends ContainerComponent implements OnInit {
  @Input() value = {
    text: '',
    valid: false,
  };
  @Input() set list(value) {  this.itemlist = value.split('|'); }
  @Input() editableValue = 'Other';
  @Input() editFieldPlaceholder = 'Enter value ...';

  itemlist: string[] = [];
  selectedItemIndex: number = null;
  editableTextValue = '';

  ngOnInit() {}

  onchange(value) {
    let txtValue: string;
    if (value !== undefined) { // update index
      this.selectedItemIndex = (value === this.selectedItemIndex) ? null : value;
    }
    txtValue = this.itemlist[this.selectedItemIndex] || '';
    if (txtValue === this.editableValue) {
      txtValue = this.editableTextValue ? this.editableTextValue : txtValue;
    }

    this.value.text = txtValue;
    this.notifyChange();
  }

  validateComponentValue() {
    this.value.valid = !!this.value.text;
  }

  postApply() {
    const { text } = this.value;

    this.selectedItemIndex = this.itemlist.findIndex(item => item === text);

    if (this.selectedItemIndex === -1) {
      this.selectedItemIndex = this.itemlist.findIndex(item => item === this.editableValue);
      this.editableTextValue = text;
    } else {
      this.editableTextValue = '';
    }
  }
}
