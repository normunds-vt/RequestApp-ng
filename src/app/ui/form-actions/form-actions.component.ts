import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

export const ERROR_MESSAGE_TIMEOUT = 10000;

@Component({
  selector: 'vt-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss']
})
export class FormActionsComponent implements OnInit, OnDestroy {

  isValid = false;
  isNewRecord = true;
  isUpdatedRecord = false;
  currentRecordId: number;
  errorContent: string;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this._subscription = this.contentService.missingRequired$.subscribe(
      value => {
        this.isValid = !value;
        this.isUpdatedRecord = this.contentService.isUpdated;
        this.isNewRecord = !this.contentService.getCurrentRecordId();
      }
    );
  }

  onSubmit() {
    clearTimeout(this._timeout);
    this.errorContent = '';
    if (this.isValid) {
      this.contentService.submitRequest();
    } else {
      this.errorContent = this._getErrorMessage();
      this._timeout = setTimeout(() => this.errorContent = '', ERROR_MESSAGE_TIMEOUT);
    }
  }

  resetRequest() {
    this.contentService.resetRequest();
  }

  deleteRequest() {
    this.contentService.deleteRequest();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private _subscription: Subscription;
  private _timeout: any;

  private  _getErrorMessage() {
    const errors = this.contentService.getMissingRequired()
      .map(pick('title'))
      .filter(value => value);
    return 'Please check for missed required fields.\n' + errors.join('\n') + '.';
  }
}

function pick(propertyName) {
  return function(obj) {
    return obj[propertyName] && obj[propertyName].replace(/:$/, '');
  };
}
