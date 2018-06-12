import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/primeng';

import { DropdownComponent } from '../dropdown/dropdown.component';
import { DatetimeslotComponent } from './datetimeslot.component';

import 'rxjs/add/operator/take';


describe('DatetimeslotComponent', () => {
  let component: DatetimeslotComponent;
  let fixture: ComponentFixture<DatetimeslotComponent>;
  // let de: DebugElement;
  // let el: HTMLElement;
  let elFromClass: Function;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        CalendarModule
      ],
      declarations: [
        DropdownComponent,
        DatetimeslotComponent
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    elFromClass = className => fixture.debugElement.query(By.css(`.${className}`));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it ('should change date if passed date type value', () => {
    const dateString = '01/01/2016';
    const dateObj = new Date(dateString);

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.date).toBe(dateString);
      expect(component.currentSelection.date).toBe(dateString);
      expect(e.isInternalEvent).toBeFalsy();
    });
    component.date = dateObj;
    fixture.detectChanges();
  });

  it (`should change date if passed date string can be parsed,
        and change to empty date string when date string cannot be parsed`, () => {
    const dateString = '10/06/2017';

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.date).toBe(dateString);
      expect(component.currentSelection.date).toBe(dateString);
      expect(e.isInternalEvent).toBeFalsy();
    });
    component.date = dateString;
    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.date).toBe('');
      expect(component.currentSelection.date).toBe('');
      expect(e.isInternalEvent).toBeFalsy();
    });
    component.date = 'invalid date';
    fixture.detectChanges();
  });

  it ('should emit changed date event object on calendar changes', (done) => {
    const dateString = '02/01/2016';
    const dateObj = new Date(dateString);

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.date).toBe(dateString);
      expect(component.currentSelection.date).toBe(dateString);
      expect(e.isInternalEvent).toBeTruthy();
      done();
    });

    elFromClass(component.calendarClassName)
      .triggerEventHandler('ngModelChange', dateObj);
    fixture.detectChanges();
  });

  it ('should change start, end time and step', () => {
    const startTime = '10:30 AM';
    const endTime = '11:30 AM';
    const step = 30;
    const expectedList = ['10:30 AM', '11:00 AM', '11:30 AM'];

    component.startTime = startTime;
    component.endTime = endTime;
    component.step = step;
    fixture.detectChanges();

    expect(component.dropdownLists[0]).toEqual(expectedList);
    expect(component.dropdownLists[1]).toEqual(expectedList);
  });

  it (`should change from and to time,
        changes in from time should be reflected in the totime list and totime value`, () => {
    const startTime = '10:30 AM';
    const endTime = '11:30 AM';
    const step = 30;
    const expectedList = ['10:30 AM', '11:00 AM', '11:30 AM'];

    const totime = expectedList[1];

    component.startTime = startTime;
    component.endTime = endTime;
    component.step = step;

    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.totime).toBe(expectedList[1]);
      expect(component.currentSelection.totime).toBe(expectedList[1]);
      expect(e.isInternalEvent).toBeFalsy();
    });

    component.totime = expectedList[1];
    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.fromtime).toBe(expectedList[1]);
      expect(component.currentSelection.fromtime).toBe(expectedList[1]);

      // to time should be moved by step to avoid 0 length selection
      expect(e.value.totime).toBe(expectedList[2]);
      expect(component.currentSelection.totime).toBe(expectedList[2]);

      // once from time is selected to time list includes length and is reduced to
      // list that contains time at the same or later time as fromtime
      const expectedWideList = ['11:00 AM', '11:30 AM (30 mins)'];
      expect(component.dropdownLists[1]).toEqual(expectedWideList);
      expect(e.isInternalEvent).toBeFalsy();
    });

    component.fromtime = expectedList[1];
    fixture.detectChanges();
  });

  it ('should report valid value only all if date, fromtime and totime all are set', () => {
    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.valid).toBeFalsy();
      expect(component.currentSelection.valid).toBeFalsy();
    });

    component.date = '01/02/2016';
    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.valid).toBeFalsy();
      expect(component.currentSelection.valid).toBeFalsy();
    });

    component.fromtime = '9:00 AM';
    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.valid).toBeTruthy();
      expect(component.currentSelection.valid).toBeTruthy();
    });

    component.totime = '10:00 AM';
    fixture.detectChanges();

    // unset from time and valid should be false
    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.valid).toBeFalsy();
      expect(component.currentSelection.valid).toBeFalsy();
    });

    component.fromtime = '';
    fixture.detectChanges();
  });

  it ('should unset to field if from field is set to last item as this gives no time slot span', () => {
    const endTime = '6:00 PM';
    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.totime).toBe(endTime);
      expect(component.currentSelection.totime).toBe(endTime);
    });

    component.endTime = endTime;
    component.step = 30;
    component.totime = endTime;

    fixture.detectChanges();

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.totime).toBe('');
      expect(component.currentSelection.totime).toBe('');
    });

    component.fromtime = endTime;
    fixture.detectChanges();

  });

  it ('should emit change events on internal time changes', () => {
    const fromtime = '11:00 AM';

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.fromtime).toBe(fromtime);
      expect(component.currentSelection.fromtime).toBe(fromtime);
      expect(e.isInternalEvent).toBeTruthy();
    });

    elFromClass(component.fromTimeSlotClassName)
      .triggerEventHandler('selected', fromtime);
    fixture.detectChanges();

    const totime = '11:30 AM';

    component.change.asObservable().take(1).subscribe( e => {
      expect(e.value.totime).toBe(totime);
      expect(component.currentSelection.totime).toBe(totime);
      expect(e.isInternalEvent).toBeTruthy();
    });

    elFromClass(component.toTimeSlotClassName)
      .triggerEventHandler('selected', totime);
    fixture.detectChanges();

  });
});
