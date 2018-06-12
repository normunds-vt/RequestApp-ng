import { IDateTimeSlotEvent } from './ui/datetimeslot/datetimeslot-event.interface';
import {
  Component,
  OnInit,
  // Input,
  // Output,
  // EventEmitter
} from '@angular/core';
import { IRequestItem } from './models/request-item.interface';
import { ContentService } from './services/content.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'open-requests',
  template: `
  <div class="panel-collapsable" *ngIf="requests$ | async as requests">
    <input
      class="panel-collapsable__toggle"
      type="checkbox"
      id="openrequest-chb">
    <label for="openrequest-chb" class="panel-collapsable__title">
    Open Requests - {{ requests.length ? requests.length : 'none' }}.
    </label>
    <div class="panel-collapsable__body">
      <div
        *ngFor="let request of requests"
        class="openrequest-item"
        [class.selected]="request.id === currentRequestId"
        title="{{ request.content }}"
        >
        <div class="openrequest-item__date">({{ request.createdOn.toLocaleString() }})</div>
        <open-request-item
          [content]="request.content"
          (select)="onSelect(request)"
        ></open-request-item>
      </div>
    </div>
  </div>
  `
})
export class OpenRequestsComponent implements OnInit {
  // @Input() requests: IRequestItem[] = [];
  // @Input() selectedRecordId: number;
  // @Output() selected = new EventEmitter<IRequestItem>();
  // @Output() delete = new EventEmitter<IRequestItem>();

  requests$ = this.contentService.getOpenRequestStream()
    .pipe( map(requests => requests.length > 0 ? requests : null));

  constructor (private contentService: ContentService) {}

  ngOnInit() {
  }

  onSelect(request: IRequestItem) {
    console.log('selecting', request);
    // this.selected.next(request);
    this.contentService.restoreRequest(request.id);
  }

  get currentRequestId () {
    return this.contentService.getCurrentRecordId();
  }

  // deleteItem(request: IRequestItem, event: Event) {
  //   // console.log('deleting');
  //   event.stopPropagation();

  //   this.delete.next(request);
  // }
}



