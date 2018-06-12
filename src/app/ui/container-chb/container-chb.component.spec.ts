import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { ContainerChbComponent } from './container-chb.component';
import { ContainerTextComponent } from '../container-text/container-text.component';
import { HDConfig } from '../../hd.config';
import { IdService } from '../id-service';

import { getContainerModuleConfig, getElementFactory } from '../Testing/moduleUtils';

const containerClassName = 'container-select';

describe('ContainerChbComponent', () => {
  let component: ContainerChbComponent;
  let fixture: ComponentFixture<ContainerChbComponent>;

  let elByCss: Function;

  beforeEach(async(() => {
    const contentServiceStub = {
      updateItem: function(path, value) {}
    };

    TestBed.configureTestingModule(
      getContainerModuleConfig({ declarations: [ ContainerChbComponent ]})
    )
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerChbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    elByCss = getElementFactory(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle select on clicking on label', () => {
    const label_checkbox = elByCss('input[type=checkbox');
    let ischecked = !!label_checkbox.nativeElement.checked;

    expect(component.isSelected).toBeFalsy();
    expect(ischecked).toBeFalsy();

    label_checkbox.triggerEventHandler('change', {
      target: { checked: !ischecked }
    });
    fixture.detectChanges();

    expect(component.isSelected).toBeTruthy();

    ischecked = !!label_checkbox.nativeElement.checked;
    expect(ischecked).toBeTruthy();
  });

  it('should use BEM notation pattern for classname use', () => {
    expect(elByCss(`.${containerClassName}`)
      .classes[containerClassName + '--selected'])
      .toBeFalsy();

    expect(elByCss(`.${containerClassName}__label`)
      .classes['selected'])
      .toBeFalsy();

    // if item is not checked content is hidden
    expect(elByCss(`.${containerClassName}__content`)
      .classes[`${containerClassName}__content--hidden`])
      .toBeTruthy();

    component.onselect(true);
    fixture.detectChanges();

    expect(elByCss(`.${containerClassName}`)
      .classes[`${containerClassName}--selected`])
      .toBeTruthy();

    expect(elByCss(`.${containerClassName}__label`)
      .classes['selected'])
      .toBeTruthy();

    expect(elByCss(`.${containerClassName}__content`)
      .classes[`${containerClassName}__content--selected`])
      .toBeFalsy();
  });

});


describe('ContainerChbComponent mock hierarchy', () => {

  @Component({
    template: `
      <container-chb title='parent'>
        <container-chb title='child1'></container-chb>
        <container-chb radioSelectChild>
          <container-chb title='grandchild1'></container-chb>
          <container-chb title='grandchild2'></container-chb>
          <!-- followoing container-text tests that does not erreor on conatiner without checked$ stream -->
          <container-text></container-text>
        </container-chb>
      </container-chb>
    `
  })
  class MockContainerHierachyComponent {}

  let component: MockContainerHierachyComponent;
  let fixture: ComponentFixture<MockContainerHierachyComponent>;
  let elByCss: Function;

  beforeEach(async(() => {
    TestBed.configureTestingModule(getContainerModuleConfig({
      declarations: [
        MockContainerHierachyComponent,
        ContainerChbComponent,
        ContainerTextComponent,
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockContainerHierachyComponent);
    component = fixture.componentInstance;
    elByCss = getElementFactory(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('parent component should have children', () => {
    fixture.detectChanges();
    const components: DebugElement[] =
      fixture.debugElement.queryAll(By.directive(ContainerChbComponent));

    const parentComponent: ContainerChbComponent = components[0].componentInstance;
    const firstChild: ContainerChbComponent = components[1].componentInstance;

    expect(parentComponent.isChildSelected()).toBeFalsy();

    firstChild.onselect(true);
    expect(parentComponent.isChildSelected()).toBeTruthy();

    firstChild.onselect(false);
    expect(parentComponent.isChildSelected()).toBeFalsy();

    parentComponent.onselect(true);
    expect(parentComponent.isChildSelected()).toBeFalsy();
  });

  it(`should be able to handle required property by setting selected and valid
      based on any child being selectd`, () => {
    const components: DebugElement[] =
    fixture.debugElement.queryAll(By.directive(ContainerChbComponent));

    const parentComponent: ContainerChbComponent = components[0].componentInstance;
    const firstChild: ContainerChbComponent = components[1].componentInstance;

    parentComponent.required = '';
    fixture.detectChanges();

    expect(parentComponent.value.isrequired).toBeTruthy();
    expect(parentComponent.value.selected).toBeFalsy();

    const firstChildCheckbox: DebugElement = elByCss(`.${containerClassName} > input[type=checkbox]`, true)[1];
    firstChildCheckbox.triggerEventHandler('change', {
      target: { checked: true }
    });
    expect(firstChild.value.selected).toBeTruthy();
    expect(parentComponent.value.selected).toBeTruthy();
  });

  it(`should be able to handle required property by setting selected and valid
      based on grandchild of radio parent being selectd `, () => {
    const components: DebugElement[] =
      fixture.debugElement.queryAll(By.directive(ContainerChbComponent));

    const parentComponent: ContainerChbComponent = components[0].componentInstance;
    const secondChild: ContainerChbComponent = components[2].componentInstance;

    const granchild: ContainerChbComponent = components[3].componentInstance;

    parentComponent.required = '';
    fixture.detectChanges();

    expect(parentComponent.value.isrequired).toBeTruthy();
    expect(parentComponent.value.selected).toBeFalsy();

    const firstGrandhildCheckbox: DebugElement =
      elByCss(`.${containerClassName}
                  .${containerClassName} > input[type=checkbox]`, true)[1];

    firstGrandhildCheckbox.triggerEventHandler('change', {
      target: { checked: true }
    });

    expect(granchild.value.selected).toBeTruthy();
    expect(secondChild.value.selected).toBeTruthy();
    expect(parentComponent.value.selected).toBeTruthy();
  });

  it('should handle post applyNewValue correctly by emitting selected event', () => {
    const components: DebugElement[] =
    fixture.debugElement.queryAll(By.directive(ContainerChbComponent));

    const parentComponent: ContainerChbComponent = components[0].componentInstance;
    const secondChild: ContainerChbComponent = components[2].componentInstance;

    const granchild: ContainerChbComponent = components[3].componentInstance;
    // initally radio conatiner does not have child selected
    expect(secondChild.isChildSelected()).toBeFalsy();

    granchild.applyNewValue({ selected: true, valid: true });
    fixture.detectChanges();
    expect(secondChild.isChildSelected()).toBeTruthy();
  });
});
