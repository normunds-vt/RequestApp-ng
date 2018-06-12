import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vt-submit-button',
  template: `
  <button
    type="button"
    rfAnimateOnClick
    class="btn {{ isValid ? 'btn--validForm' : 'btn--notValidForm' }}"
    (click)="onclick.emit()"
  >
    <ng-content></ng-content></button>
  `,
})
export class SubmitButtonComponent {
  @Input() isValid: boolean;
  @Output() onclick = new EventEmitter<Event>();
}
