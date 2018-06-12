import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ContainerTimeComponent } from './container-time.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { getContainerModuleConfig, getElementFactory } from '../Testing/moduleUtils';

describe('ContainerTimeComponent', () => {
  let component: ContainerTimeComponent;
  let fixture: ComponentFixture<ContainerTimeComponent>;
  let el: Function;

  const moduleConfig = getContainerModuleConfig({
    declarations: [
      ContainerTimeComponent,
      DropdownComponent
    ]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTimeComponent);
    component = fixture.componentInstance;
    el = getElementFactory(fixture);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should respond to change event in time control and validate event value', () => {
    const timeControl: DebugElement = el('.js-time');

    timeControl.triggerEventHandler('selected', '10:30 AM');
    expect(component.isValid).toBeTruthy('10:30 AM event');

    timeControl.triggerEventHandler('selected', '');
    expect(component.isValid).toBeFalsy('empty event');

    timeControl.triggerEventHandler('selected', 'abc');
    expect(component.isValid).toBeFalsy('abc event');
  });
});
