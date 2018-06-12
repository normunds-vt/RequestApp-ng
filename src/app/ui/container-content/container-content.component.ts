import { Component, OnInit, forwardRef } from '@angular/core';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'container-content',
  templateUrl: './container-content.component.html',
  styleUrls: ['./container-content.component.scss'],
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerContentComponent)
  }],
})
export class ContainerContentComponent extends ContainerComponent {

  value = {
    text: '',
    attachements: [],
    valid: false,
    required: false,
  };

  errorStr: string;

  onUpdate = (updates) => {
    this.value.text = updates.content;
    this.value.attachements = updates.attachements;
    this.validateComponentValue();
    this.notifyChange();
  }

  validateComponentValue() {
    this.value.valid = ('' + this.value.text).length > 3;
    this.errorStr = this.value.valid ? '' : 'value required';
  }
}
