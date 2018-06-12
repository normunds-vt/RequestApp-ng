import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ContainerComponent } from '../container/container.component';

import { TimeUtil } from '../../utils/time-util';

@Component({
  selector: 'container-time',
  templateUrl: './container-time.component.html',
  providers: [{
    provide: ContainerComponent,
    useExisting: forwardRef(() => ContainerTimeComponent)
  }],
})
export class ContainerTimeComponent extends ContainerComponent
                                    implements OnInit {
  @Input() value: { time: string, valid: boolean } = { time: null, valid: false };

  @Input() startTime;
  @Input() endTime;
  @Input() step;

  dropdownList: string[] = [];

  ngOnInit() {
    const { startTime, endTime, step } = this.config.timeDropdown;
    // use provided inputs or default to configuration set values
    this.startTime = this.startTime || startTime;
    this.endTime = this.endTime || endTime;
    this.step = this.step || step;

    this.dropdownList = TimeUtil.buildListFromTo(this.startTime, this.endTime, this.step);
  }
  onchange(value) {
    this.value.time = value;
    this.notifyChange();
  }

  validateComponentValue() {
    this.value.valid = !!this.value.time && TimeUtil.isTime(this.value.time);
  }
}
