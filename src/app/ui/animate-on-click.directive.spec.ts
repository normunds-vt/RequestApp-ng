import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnimateOnClickDirective } from './animate-on-click.directive';

@Component({
  template: `
    <button type="button" id="default" rfAnimateOnClick>Animated</button>
    <button type="button" id="custom" [rfAnimateOnClick]="customClass">Animated Custom Class</button>
    <button type="button" class="other-class" [rfAnimateOnClick]="customClass">Animated Other Class</button>
  `
})
class TestComponent {
  customClass = CUSTOM_CLASS;
}

const CUSTOM_CLASS = 'customAnimate';

describe('Click animate directive', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ AnimateOnClickDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges();
  });

  it(`should have assigned to host default 'animate' class after click`, () => {
    const de = fixture.debugElement.query(By.css('#default'));
    expect(de.nativeElement.classList.contains('animate')).toBeFalsy();
    const click = new MouseEvent('click');
    de.nativeElement.dispatchEvent(click);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains('animate')).toBeTruthy();
  });

  it(`should have remove assigned animation class after click`, () => {
    const de = fixture.debugElement.query(By.css('#default'));
    const click = new MouseEvent('click');
    de.nativeElement.dispatchEvent(click);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains('animate')).toBeTruthy();

    const animationend = new AnimationEvent('animationend');
    de.nativeElement.dispatchEvent(animationend);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains('animate')).toBeFalsy();
  });

  it(`should have as'signed to host '${CUSTOM_CLASS}' class after click`, () => {
    const de = fixture.debugElement.query(By.css('#custom'));

    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeFalsy();
    const click = new MouseEvent('click');
    de.nativeElement.dispatchEvent(click);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeTruthy();
  });

  it(`should have remove assigned custom animation class after click`, () => {
    const de = fixture.debugElement.query(By.css('#custom'));
    const click = new MouseEvent('click');
    de.nativeElement.dispatchEvent(click);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeTruthy();

    const animationend = new AnimationEvent('animationend');
    de.nativeElement.dispatchEvent(animationend);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeFalsy();
  });

  it(`addition and removal of animation classes should not affect other classes assigned to host`, () => {
    const de = fixture.debugElement.query(By.css('.other-class'));
    const click = new MouseEvent('click');
    de.nativeElement.dispatchEvent(click);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeTruthy();
    expect(de.nativeElement.classList.contains('other-class')).toBeTruthy('should contain other-class');

    const animationend = new AnimationEvent('animationend');
    de.nativeElement.dispatchEvent(animationend);
    fixture.detectChanges();
    expect(de.nativeElement.classList.contains(CUSTOM_CLASS)).toBeFalsy();
    expect(de.nativeElement.classList.contains('other-class')).toBeTruthy();
  });
});

