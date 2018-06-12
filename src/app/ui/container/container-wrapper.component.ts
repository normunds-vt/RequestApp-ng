import { Component, Input } from '@angular/core';

@Component({
  selector: 'container-wrapper',
  template: `
    <div
      class="container {{ additionalClasses }}"
      [class.container--required]="isRequired"
      [class.container--error]="isRequired && !isValid"
    >
      <ng-content></ng-content>
    </div>
    `
})
export class ContainerWrapperComponent {
  @Input() isRequired = false;
  @Input() isValid = false;
  @Input('addClasses') additionalClasses = '';
}
