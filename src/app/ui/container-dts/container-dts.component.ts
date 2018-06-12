import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ContainerComponent } from '../container/container.component';

import { IDateTimeSlot } from '../datetimeslot/datetimeslot.interface';
import { IValue } from '../container/value.interface';

const onlyProps = props => obj => {
  return props
    .replace(/, /g, ',')
    .split(',')
    .reduce((acc, key) => {
      acc[key] = obj[key];
      if (!obj.hasOwnProperty(key)) {
        acc.missingProps = acc.missingProps
          ? acc.missingProps.concat(key)
          : [key];
      }
      return acc;
    }, Object.create(null));
};
const dtsProps = onlyProps('date, fromtime, totime');

@Component({
  selector: 'container-dts',
  templateUrl: './container-dts.component.html',
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerDtsComponent)
  }],
})
export class ContainerDtsComponent extends ContainerComponent
                                   implements OnInit {
  @Input() dateLabel = '';
  @Input() startLabel = ' starting: ';
  @Input() endLabel = ' ending: ';

  @Input() startTime;
  @Input() endTime;
  @Input() step;

  value = {
    date: null,
    fromtime: null,
    totime: null,
    valid: false,
    missingProps: null,
  };

  dateformat: string;
  dateformatPrime: string;
  disabledDays = [];
  placeholder: string;

  ngOnInit() {
    const { startTime, endTime, step } = this.config.timeDropdown;
    // use provided inputs or default to configuration set values
    this.startTime = this.startTime || startTime;
    this.endTime = this.endTime || endTime;
    this.step = this.step || step;

    this.dateformat = this.config.dateformat || 'mm/dd/yyyy';
    this.dateformatPrime = this.dateformat.replace(/yyyy/, 'yy');
    this.disabledDays = this.config.disabledDays;
    this.placeholder = this.dateformat.toUpperCase();
  }

  onchange(event) {
    if (event.isInternalEvent) {
      const value = dtsProps(event.value);
      Object.assign(this.value, value);
      this.notifyChange();
    }
  }

  validateComponentValue() {
    this.value.valid =
      !!this.value.date &&
      !!this.value.fromtime &&
      !!this.value.totime;
  }
}
