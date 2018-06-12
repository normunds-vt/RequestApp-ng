import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';

import { FormActionsComponent, ERROR_MESSAGE_TIMEOUT } from './form-actions.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { ContentService } from '../../services/content.service';
import { RemoteService } from '../../services/remote.service';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;
  let contentService: ContentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormActionsComponent,
        SubmitButtonComponent,
      ],
      providers: [
        ContentService,
        { provide: RemoteService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    contentService = TestBed.get(ContentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call forward resetRequest to contentService resetRequest', () => {
    const spy = spyOn(contentService, 'resetRequest');

    component.resetRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call forward deleteRequest to contentService deleteRequest', () => {
    const spy = spyOn(contentService, 'deleteRequest');

    component.deleteRequest();
    expect(spy).toHaveBeenCalled();
  });
});

describe('FormActionsComponent content service subscribtions', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;
  let contentService: ContentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormActionsComponent,
        SubmitButtonComponent,
      ],
      providers: [
        ContentService,
        { provide: RemoteService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    contentService = TestBed.get(ContentService);
    fixture.detectChanges();
  });

  it(`submit button should invoke content service submit if content service stream does not
      have missing required fields`, () => {

    const testFieldTitle = 'Test field title required';
    const spySubmitRecord = spyOn(contentService, 'submitRequest');
    const spyGetMissingRequired = spyOn(contentService, 'getMissingRequired')
      .and.returnValue([{ title: testFieldTitle }]);

    // set content service to inform that there are no missed required fields and
    // form can be submitted
    contentService.missingRequired$.next(false);
    component.onSubmit();
    fixture.detectChanges();

    expect(spySubmitRecord).toHaveBeenCalled();
    expect(spyGetMissingRequired).not.toHaveBeenCalled();

    expect(fixture.debugElement.nativeElement.textContent).not.toContain(testFieldTitle);
  });

  it(`submit button should not invoke content service submit if content service stream
      has missing required fields, and should show an error message that contains
      titles of missing required fields`, () => {

    const testFieldTitle = 'Test field title required';
    const spySubmitRecord = spyOn(contentService, 'submitRequest');
    const spyGetMissingRequired = spyOn(contentService, 'getMissingRequired')
      .and.returnValue([{ title: testFieldTitle }]);

    // set content service to inform that there are no missed required fields and
    // form can be submitted
    contentService.missingRequired$.next(true);
    component.onSubmit();
    fixture.detectChanges();

    expect(spySubmitRecord).not.toHaveBeenCalled();
    expect(spyGetMissingRequired).toHaveBeenCalled();

    expect(fixture.nativeElement.textContent).toContain(testFieldTitle);
  });

  it(`submit error message should be available for ${ERROR_MESSAGE_TIMEOUT}
      and disappear after`, fakeAsync(() => {

    const testFieldTitle = 'Test field title required';
    const spyGetMissingRequired = spyOn(contentService, 'getMissingRequired')
      .and.returnValue([{ title: testFieldTitle }]);

    contentService.missingRequired$.next(true);
    component.onSubmit();
    fixture.detectChanges();

    expect(spyGetMissingRequired).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(testFieldTitle);

    tick(ERROR_MESSAGE_TIMEOUT);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain(testFieldTitle);
  }));

  it('new record should have Submit and Cancel buttons', () => {
    const spyGetCurrentRecordId = spyOn(contentService, 'getCurrentRecordId').and.returnValue(null);

    // next is used only to activate new state so next value is not used in this test
    contentService.missingRequired$.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Submit');
    expect(fixture.nativeElement.textContent).toContain('Cancel');
  });

  it(`should show delete button if record has id (is existing)
      and has not been edited. Edited existing record should have update button`, () => {
    const spyGetCurrentRecordId = spyOn(contentService, 'getCurrentRecordId').and.returnValue(null);

    // next is used only to activate new state so next value is not used in this test
    contentService.missingRequired$.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent)
      .not.toContain('Delete');

    spyGetCurrentRecordId.and.returnValue(1);  // existing record
    contentService.missingRequired$.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Delete');
    expect(fixture.nativeElement.textContent).not.toContain('Submit');

    // make sure content service isUpdated exists
    if (typeof contentService.isUpdated === 'undefined') {
      throw new Error('missing isUpdated property in content service');
    }
    // set content service to updated value
    contentService.isUpdated = true;
    contentService.missingRequired$.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Delete');
    expect(fixture.nativeElement.textContent).toContain('Update');
  });
});
