import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DropdownComponent } from './dropdown.component';

const containerClass = '.vt-dropdown-container';
const itemValueClass = '.vt-dropdown__value';
const listItemClass = '.vt-dropdown__item';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it ('should reflect list of provided entries', () => {
    const list = ['A', 'B'];

    component.list = list;
    fixture.detectChanges();

    const containerTextContentArr =
      fixture.debugElement.queryAll(By.css(listItemClass))
        .map(listEl => listEl.nativeElement.textContent);

    expect(containerTextContentArr).toEqual(list);
  });

  it ('should show selected item on the list', () => {
    const selectedItem = 'B';
    const list = ['A', selectedItem, 'C', 'D'];
    component.list = list;
    component.select = selectedItem;

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));

    expect(de.nativeElement.textContent).toBe(selectedItem);
  });

  it ('should respond to keyboard events', () => {
    const list = ['A', 'B', 'C'];
    component.list = list;
    component.select = list[0];
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css(containerClass));

    // arrow down event
    container.triggerEventHandler('keydown', { code: 'ArrowDown'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe(list[1]);

    // arrow up event
    container.triggerEventHandler('keydown', { code: 'ArrowUp'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe(list[0]);

    // moving past first item using ArrowUp event should remain at the first item
    container.triggerEventHandler('keydown', { code: 'ArrowUp'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe(list[0]);

    // backspace / delete key event
    container.triggerEventHandler('keydown', { code: 'Backspace'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe('');

    // enter key to close when in focus
    container.triggerEventHandler('focus', null);
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(containerClass));
    expect(de.nativeElement.className).toContain('show');

    // enter event should remove show class closing dropdown
    container.triggerEventHandler('keydown', { code: 'Enter'});
    fixture.detectChanges();

    expect(de.nativeElement.className).not.toContain('show');
  });

  it ('should handle wide component (time with span length)', () => {
    const list = ['8:00 AM', '8:30 AM (30 min)', '9:00 AM (1 hr)'];
    component.isWide = true;
    component.list = list;
    component.select = list[1];
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe('8:30 AM');

    const container = fixture.debugElement.query(By.css(containerClass));
    container.triggerEventHandler('keydown', { code: 'ArrowDown'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe('9:00 AM');
  });

  it ('should be able to scroll to currently selected element on focus', () => {
    const list = Array(100).fill('').map((_, index) => 'item_' + index);
    component.list = list;
    component.select = list[60];
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css(containerClass));
    container.triggerEventHandler('focus', null);
    fixture.detectChanges();

    container.triggerEventHandler('keydown', { code: 'ArrowDown'});
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(itemValueClass));
    expect(de.nativeElement.textContent).toBe(list[61]);
  });

  it ('should select dropdown item and emit value of selected item on click event', () => {
    const list = ['A', 'B'];
    component.list = list;
    fixture.detectChanges();

    spyOn(component.selected, 'emit');
    const items: DebugElement[] = fixture.debugElement.queryAll(By.css(listItemClass));

    items[0].triggerEventHandler('click', null);

    expect(component.selected.emit).toHaveBeenCalledWith(list[0]);
  });
});
