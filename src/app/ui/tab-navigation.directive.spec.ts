import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabNavigationDirective } from './tab-navigation.directive';

@Component({
  template: '<div rfTabNavigation></div>'
})
class TestComponent { }

describe('TabNavigationDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ TabNavigationDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TabNavigationDirective();
    expect(directive).toBeTruthy();
  });

  it(`element with with this directive should have keyboard-interaction class
      assigned after keyboard Tab key is pressed`, () => {

    fixture.detectChanges();
    const host = fixture.debugElement.query(By.css('div[rfTabNavigation]')).nativeElement;
    expect(host.classList.contains('keyboard-interaction')).toBeFalsy();
    const tabKeyEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'Tab',
    });

    fixture.nativeElement.dispatchEvent(tabKeyEvent);
    fixture.detectChanges();
    expect(host.classList.contains('keyboard-interaction')).toBeTruthy();
  });

  it(`element with with this directive should have keyboard-interaction class
      assigned anly after keyboard tab key is pressed`, () => {

    fixture.detectChanges();
    const host = fixture.debugElement.query(By.css('div[rfTabNavigation]')).nativeElement;
    expect(host.classList.contains('keyboard-interaction')).toBeFalsy();
    const tabKeyEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'A',
    });

    fixture.nativeElement.dispatchEvent(tabKeyEvent);
    fixture.detectChanges();
    expect(host.classList.contains('keyboard-interaction')).toBeFalsy();
  });

  it(`element with with this directive should have keyboard-interaction class
    removed after mousemove is detected`, () => {

    const host = fixture.debugElement.query(By.css('div[rfTabNavigation]'));
    const tabDirective = host.injector.get(TabNavigationDirective);
    tabDirective.isTabbed = true;

    fixture.detectChanges();
    expect(host.nativeElement.classList.contains('keyboard-interaction')).toBeTruthy();

    const mouseEvent = new MouseEvent('mousemove', { bubbles: true });
    fixture.nativeElement.dispatchEvent(mouseEvent);
    fixture.detectChanges();
    expect(host.nativeElement.classList.contains('keyboard-interaction')).toBeFalsy();
  });
});
