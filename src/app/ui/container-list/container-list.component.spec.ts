import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContainerListComponent } from './container-list.component';
import { getContainerModuleConfig, getElementFactory } from '../Testing/moduleUtils';

describe('ContainerListComponent', () => {
  let component: ContainerListComponent;
  let fixture: ComponentFixture<ContainerListComponent>;
  let el: Function;

  const moduleConfig = getContainerModuleConfig({
    declarations: [ ContainerListComponent ]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerListComponent);
    component = fixture.componentInstance;
    el = getElementFactory(fixture);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should use | separated list to create checkboxes for values and <hr> markup for empty values', () => {
    component.list = 'One|Two||Three';
    fixture.detectChanges();

    const checkboxes: DebugElement[] = el('input[type=checkbox]', true);
    const hrElementsArray: DebugElement[] = el('hr', true);
    expect(checkboxes.length).toBe(3);
    expect(hrElementsArray.length).toBe(1);
  });

  it('should have "Other" input box available when the Other value is selected', () => {
    const list = 'One|Two|Other';
    component.list = list;
    fixture.detectChanges();
    const allElements = true;
    const checkboxes: DebugElement[] = el('input[type=checkbox]', allElements);
    expect(checkboxes.length).toBe(3);
    expect(el('input[type=text]')).toBeFalsy();
    component.selectedItemIndex = list.length - 1; // last element - Other
    fixture.detectChanges();
    expect(el('input')).toBeTruthy();
  });

  it('should have allow different text for the "Other" option as editableValue property ', () => {
    const editableValue = 'Editable';
    const list = `One|${editableValue}|Two`;
    const editableIndex = 1;
    component.editableValue = editableValue;
    component.list = list;
    // create checkboxes
    fixture.detectChanges();
    // should not have text input available yet
    expect(el('input[type=text]')).toBeFalsy();

    // select editable field
    component.selectedItemIndex = editableIndex;
    fixture.detectChanges();
    expect(el('input[type=text]')).toBeTruthy();
  });

  it('on item selection or editable value change it should validate and update component value', async(() => {
    const list = 'One|Two|Other';
    component.list = list;
    fixture.detectChanges();
    const allElements = true;
    const checkboxes: DebugElement[] = el('input[type=checkbox]', allElements);

    checkboxes[1].triggerEventHandler('change', 1);

    expect(component.value.text).toBe(list.split('|')[1]);
    expect(component.value.valid).toBeTruthy();

    // select Other
    checkboxes[2].triggerEventHandler('change', 2);
    fixture.detectChanges();
    expect(component.value.text).toBe(list.split('|')[2]);
    expect(component.value.valid).toBeTruthy();

    const input: DebugElement = el('input[type=text]');
    const inputValue = 'new value';
    input.nativeElement.value = inputValue;

    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.value.text).toBe(inputValue);
  }));

  it('should allow to uncheck selection', async(() => {
    const list = 'One|Two|Other';
    component.list = list;
    fixture.detectChanges();
    const allElements = true;
    const checkboxes: DebugElement[] = el('input[type=checkbox]', allElements);

    checkboxes[1].triggerEventHandler('change', 1);

    expect(component.value.text).toBe(list.split('|')[1]);
    expect(component.value.valid).toBeTruthy();

    checkboxes[1].triggerEventHandler('change', 1);
    fixture.detectChanges();
    expect(component.value.text).toBe('');
    expect(component.value.valid).toBeFalsy();

    // select Other
    checkboxes[2].triggerEventHandler('change', 2);
    fixture.detectChanges();

    const input: DebugElement = el('input[type=text]');
    const inputValue = 'new value';
    input.nativeElement.value = inputValue;

    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.value.text).toBe(inputValue);

    checkboxes[2].triggerEventHandler('change', 2);
    expect(component.value.text).toBe('');
  }));

it ('should updated internal state correctly after applyNewValue', async(() => {
    const list = 'One|Two|Other';
    const notInTheList = 'Not in the list';
    component.list = list;
    fixture.detectChanges();

    component.applyNewValue({ text: 'Two'});
    fixture.detectChanges();

    expect(component.selectedItemIndex).toBe(1);
    expect(component.editableTextValue).toBe('');
    // checking ui interface
    expect(el('input[type=checkbox]', true)[1].nativeElement.checked)
      .toBeTruthy();

    component.applyNewValue({ text: notInTheList});
    fixture.detectChanges();

    expect(component.selectedItemIndex).toBe(2);
    expect(component.editableTextValue).toBe(notInTheList);
    expect(el('input[type=checkbox]', true)[2].nativeElement.checked)
      .toBeTruthy();
    fixture.whenStable().then(() => {
      const textInput = el('input[type=text]').nativeElement;
      expect(textInput).toBeDefined();
      expect(textInput.value).toBe(notInTheList);
    });
  }));
});
