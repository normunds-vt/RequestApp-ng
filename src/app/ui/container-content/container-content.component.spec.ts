import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ContainerContentComponent } from './container-content.component';
import { ContentComponent } from '../content/content.component';
import { ContainerWrapperComponent } from '../container/container-wrapper.component';

import { getContainerModuleConfig, getElementFactory } from '../Testing/moduleUtils';
import { ContentService } from '../../services/content.service';

describe('ContainerContentComponent', () => {
  let component: ContainerContentComponent;
  let fixture: ComponentFixture<ContainerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      getContainerModuleConfig({
        declarations: [
          ContainerContentComponent,
          ContentComponent,
        ],
        imports: [ ReactiveFormsModule ]
      })
    )
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onUpdate function passed in content component should invoke notify change with correct values', () => {
    const contentComponent: ContentComponent = fixture.debugElement.query(By.directive(ContentComponent)).componentInstance;
    const contentService = TestBed.get(ContentService);
    const updateSpy = spyOn(contentService, 'updateItem');

    const updates = { content: 'hello', attachements: [] };
    contentComponent.onUpdate(updates);
    expect(component.value.text).toBe(updates.content);
    expect(component.value.attachements).toBe(updates.attachements);
    expect(component.value.valid).toBeTruthy();
    expect(component.errorStr.length).toBe(0);

    expect(updateSpy).toHaveBeenCalled();
    const notifiedValue = updateSpy.calls.mostRecent().args[1];
    expect(notifiedValue.text).toBe(updates.content);
    expect(notifiedValue.attachements).toBe(updates.attachements);
    expect(notifiedValue.valid).toBeTruthy();

    contentComponent.onUpdate({ content: '', attachements: [] });
    expect(component.errorStr.length).toBeGreaterThan(0);
    expect(component.value.valid).toBeFalsy();
  });
});
