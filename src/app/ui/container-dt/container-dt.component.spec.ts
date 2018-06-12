import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContainerDtComponent } from '../container-dt/container-dt.component';
import { HDConfig } from '../../hd.config';

import * as dateFormat from 'dateformat';

import { getContainerModuleConfig } from '../Testing/moduleUtils';

const  contentServiceStub = { updateItem: function(path, value) { } };

const moduleConfig = getContainerModuleConfig({
  declarations: [ ContainerDtComponent]
});

export const getElementFactory = fixture => cssIdentifyer =>
  fixture.debugElement.query(By.css(cssIdentifyer));

describe('ComponenDtComponent', () => {
  let component: ContainerDtComponent;
  let fixture: ComponentFixture<ContainerDtComponent>;
  let el: Function;

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleConfig)
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDtComponent);
    component = fixture.componentInstance;
    el = getElementFactory(fixture);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should format date as mm/dd/yyyy string and invoke notification', () => {
    const testDateString = '02/01/2016';
    const testDate = new Date(testDateString);

    const dateformat = (TestBed.get(HDConfig) as HDConfig).dateformat || 'mm/dd/yyy';
    const testDateFormatted = dateFormat(testDate, dateformat);

    const notificationSpy = spyOn(component, 'notifyChange')
                                          .and.callThrough();
    const datePicker = el('.datepicker');
    datePicker.triggerEventHandler('ngModelChange', testDate);

    expect(component.value.date).toBe(testDateFormatted);
    expect(component.isValid).toBeTruthy();
    expect(notificationSpy.calls.count()).toBe(1);

    datePicker.triggerEventHandler('ngModelChange', null);
    expect(component.value.date).toBe('');
    expect(component.isValid).toBeFalsy();
    expect(notificationSpy.calls.count()).toBe(2);
  });

  it('model changes should be reflected in input', () => {
    const dateformat = (TestBed.get(HDConfig) as HDConfig).dateformat || 'mm/dd/yyy';
    const testDateString = dateFormat(new Date(2016, 2, 3), dateformat);
    component.value.date = testDateString;

    const input = el('input');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(input.nativeElement.value).toBe(testDateString);
    });
  });
});

describe('ComponenDtComponent HDconfig', () => {
  let component: ContainerDtComponent;
  let fixture: ComponentFixture<ContainerDtComponent>;
  let el: Function;

  const newdateformat = 'yyyy-mm-dd';
  const hdConfig = new HDConfig();
  hdConfig.dateformat = newdateformat;

  const customModuleConfig = getContainerModuleConfig({
    config: hdConfig,
    declarations: [ ContainerDtComponent ]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule(customModuleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDtComponent);
    component = fixture.componentInstance;
    // get configuration instance and make updates before component is init
    // (TestBed.get(HDConfig) as HDConfig).dateformat = newdateformat;
    el = getElementFactory(fixture);
    fixture.detectChanges();
  });

  it('dateformat should be reflected in component', () => {
    const datepicker = fixture.debugElement.query(By.css('.datepicker'))
      .componentInstance;

    expect(component.dateformat).toBe(newdateformat);

    const testDateString = '02/01/2016';
    const testDate = new Date(testDateString);

    const newFormattedDate = dateFormat(testDate, newdateformat);

    const datePicker = el('.datepicker');
    datePicker.triggerEventHandler('ngModelChange', testDate);

    expect(component.value.date).toBe(newFormattedDate);

    const input = el('.datePickerInput') || el('input');
    // if(input) {  // it may not possible to assign class to input
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe(newFormattedDate);
      });
    // }
  });
});
