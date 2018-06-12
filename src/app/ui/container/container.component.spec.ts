import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ContainerComponent } from './container.component';
import { HDConfig } from '../../hd.config';
import { ContentService } from '../../services/content.service';
import { IdService } from '../id-service';

class MockContainerComponent extends ContainerComponent {
  validateComponentValue() {
    this.value.valid = !!this.value.selected;
  }
}

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;

  let contentService;

  beforeEach(async(() => {
    const contentServiceStub = {
      updateItem: function(path, value) {}
    };

    TestBed.configureTestingModule({
      declarations: [ ContainerComponent, MockContainerComponent ],
      providers: [
        { provide: ContentService, useValue: contentServiceStub },
        HDConfig,
        IdService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockContainerComponent);
    component = fixture.componentInstance;

    contentService = TestBed.get(ContentService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ideally test would make sure that relevant internal changes be sent
  // to content service
  // the best can be done here is making sure that internal notifyChange
  // that is should be called after internal update is executing correctly
  it (`on notifyChange should invoke validateComponentValue and
    ContentService update item with correct path and value object`, () => {
    const componentPath = 'testpath';
    component.path = componentPath;

    const validationSpy = spyOn(component, 'validateComponentValue')
      .and.callThrough();
    const serviceSpy = spyOn(contentService, 'updateItem');
    component.notifyChange();

    expect(validationSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalledWith(componentPath, {
      valid: false
    });
  });

  it('should have default properties isRequired and isValid falsy', () => {
    expect(component.isRequired).toBeFalsy();
    expect(component.isValid).toBeFalsy();

    // set required
    component.required = '';
    expect(component.isRequired).toBeTruthy();
  });

  it(`should copy object properties provided in applyNewValue to
      the component value property object and validate component`, () => {
    const validationSpy = spyOn(component, 'validateComponentValue')
      .and.callThrough();

    expect(component.value).toEqual({}, 'default value');
    component.applyNewValue({ selected: true });
    expect(component.isValid).toBeTruthy();
    expect(validationSpy).toHaveBeenCalled();
  });

  it('should have accessible HD config', () => {
    expect(component.config).toBeDefined();
  });

});
