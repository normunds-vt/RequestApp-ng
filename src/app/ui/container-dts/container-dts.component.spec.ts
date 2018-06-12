import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ContainerDtsComponent } from './container-dts.component';
import { DatetimeslotComponent } from '../datetimeslot/datetimeslot.component';
import { DropdownComponent } from '../dropdown/dropdown.component';

import { getContainerModuleConfig, getElementFactory } from '../Testing/moduleUtils';
import { HDConfig } from '../../hd.config';

describe('ContainerDtsComponent', () => {
  let component: ContainerDtsComponent;
  let fixture: ComponentFixture<ContainerDtsComponent>;
  let el: Function;

  const moduleConfig = getContainerModuleConfig({
    declarations: [
      ContainerDtsComponent,
      DatetimeslotComponent,
      DropdownComponent,
    ]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDtsComponent);
    component = fixture.componentInstance;
    el = getElementFactory(fixture);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should respond to timeslot on change event, runs validation', () => {
    const datetimeslot: DebugElement = el('.js-datetimeslot');
    const date = '12/05/2017';
    const fromtime = '10:00 AM';
    const totime = '11:00 AM';

    datetimeslot.triggerEventHandler('change', {
      isInternalEvent: true,
      value: { date, fromtime, totime }
    });
    expect(component.value.date).toBe(date);
    expect(component.value.fromtime).toBe(fromtime);
    expect(component.value.totime).toBe(totime);
    expect(component.isValid).toBeTruthy();

    // unset to time
    datetimeslot.triggerEventHandler('change', {
      isInternalEvent: true,
      value: { date, fromtime, totime: '' }
    });
    expect(component.isValid).toBeFalsy();

    datetimeslot.triggerEventHandler('change', {
      isInternalEvent: true,
      value: { }
    });

    expect(component.value.missingProps)
      .toEqual(['date', 'fromtime', 'totime']);
  });

  // this is handled by checking missing properties above rather than calling
  // on change method directy here
  // it('should throw if there is missing property in on change event object', async(() => {
  //   const datetimeslot: DebugElement = el('.js-datetimeslot');

  //   // to get to Throw error here needs to invoke component function directly
  //   expect(() => {
  //     component.onchange( {
  //       isInternalEvent: true,
  //       value: { }
  //     })
  //   }).toThrowError('Missing properties for datetimeslot control update date, fromtime, totime')
  // }));
});

describe('ContainerDtsComponent dateformat without dateformat setting in HD config', () => {
  let component: ContainerDtsComponent;
  let fixture: ComponentFixture<ContainerDtsComponent>;
  const hdConfig = new HDConfig();
  // unset dateformat to test componet default dateformat
  hdConfig.dateformat = undefined;

  const moduleConfig = getContainerModuleConfig({
    hdConfig,
    declarations: [
      ContainerDtsComponent,
      DatetimeslotComponent,
      DropdownComponent,
    ]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be mm/dd/yyyy', () => {
    expect(component.dateformat).toBe('mm/dd/yyyy');
  });

});
