import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'open-request-item',
  template: `
    <div class="openrequest-item__title">{{ _contentDisplay }}</div>
    <button
      *ngIf="_totalLines > _lines"
      class="btn-view-more"
      (click)="toggleView()"
      type="button">View {{
      _isOpen ? 'less' : 'more' }}...</button>
    <div>
      <button
        (click)="onSelect()"
        type="button">Select for edit</button>
    </div>
  `
})
export class OpenRequestItemComponent {
  _content: string;
  _contentDisplay: string;
  _isOpen = false;
  _totalLines: number;

  @Input() set content(value) {
    this._content = value.replace('Date and time: ', '');
    this._totalLines = value.split('\n').length;
    this.updateDisplay();
  }
  @Input() _lines = 2;

  @Output() select = new EventEmitter<void>();

  updateDisplay() {
    this._contentDisplay = this._isOpen
      ? this._content
      : this._content
        .split('\n')
        .slice(0, this._lines)
        .join('\n');
  }

  toggleView() {
    this._isOpen = !this._isOpen;
    this.updateDisplay();
  }

  onSelect() {
    this.select.emit();
  }
}
