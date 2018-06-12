import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation } from '@angular/core';

// import dateFormat without * as fails in karma / jasmine tests as it finds dateFormat undefined
import * as dateFormat from 'dateformat';

import { TimeUtil } from '../../utils/time-util';
import { IDateTimeSlot } from './datetimeslot.interface';
import { IDateTimeSlotEvent } from './datetimeslot-event.interface';

const { buildListFromTo, minToTime, timeToMin} = TimeUtil;

const dateFormatMask = 'mm/dd/yyyy';

@Component({
  selector: 'vt-datetimeslot',
  templateUrl: './datetimeslot.component.html',
  styleUrls: ['./datetimeslot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatetimeslotComponent implements OnInit {
  FROM_TIME = 'fromtime';
  TO_TIME = 'totime';

  @Input() dateLabel = 'Date: ';
  @Input() startLabel = ' starting: ';
  @Input() endLabel = ' ending: ';

  @Input() set date(value: string | Date) { this.setDate(value, false); }

  @Input() set fromtime(value: string) { this.setTime(this.FROM_TIME, value, false); }
  @Input() set totime(value: string) { this.setTime(this.TO_TIME, value, false); }

  @Input() startTime = '8:00 AM';
  @Input() endTime = '7:00 PM';
  @Input() step = 10;

  @Input() dateFormat = 'mm/dd/yy';
  @Input() disabledDays = [0, 6];
  @Input() placeholder: string;

  @Output() change = new EventEmitter<IDateTimeSlotEvent>();

  calendarClassName = 'datetimeslot__calendar';
  fromTimeSlotClassName = 'datetimeslot__from';
  toTimeSlotClassName = 'datetimeslot__to';

  _date: Date = null;

  currentSelection: IDateTimeSlot = {
    date: null,
    fromtime: '',
    totime: '',
    valid: false
  };

  get dropdownLists() {
    return [
      buildListFromTo(this.startTime, this.endTime, +this.step, false, false),
      buildListFromTo(
        this.currentSelection.fromtime || this.startTime,
        this.endTime,
        +this.step,
        false,
        !!this.currentSelection.fromtime)
    ];
  }

  // @ViewChild('datepicker') datepicker;
  ngOnInit() {
  }

  setDate(value: string | Date, isInternalEvent = true) {
    if (value instanceof Date) {
      this._date = value;
      this.currentSelection.date = dateFormat(value, dateFormatMask);
    } else {
      if (!isNaN(Date.parse(value))) {
        this._date = new Date(value as string);
        this.currentSelection.date = value;
      } else {
        this._date = null;
        this.currentSelection.date = '';
      }
    }
    this.notify(isInternalEvent);
  }

  setTime(which, value, isInternal = true) {
    this.currentSelection[which] = value;
    if (which === this.FROM_TIME) {
      const fromMin = timeToMin(this.currentSelection.fromtime);
      const toMin = timeToMin(this.currentSelection.totime);

      if (fromMin >= toMin - this.step) {
        const newToTimeMin = fromMin + this.step;
        const newToTime = (newToTimeMin <= timeToMin(this.endTime))
          ? minToTime(newToTimeMin)
          : '';

        this.currentSelection.totime = newToTime;
      }
    }
    this.notify(isInternal);
  }

  notify(isInternalEvent) {
    this.validate();
    const value = Object.assign({}, this.currentSelection);
    this.change.emit({ value, isInternalEvent });
  }

  validate() {
    this.currentSelection.valid =
      (!!this.currentSelection.date &&
      !!this.currentSelection.fromtime &&
      !!this.currentSelection.totime) as boolean;
  }

  get primeDateFormat() { return this.dateFormat.replace(/yyyy/, 'yy'); }
 }
