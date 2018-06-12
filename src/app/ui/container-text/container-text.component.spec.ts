import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ContainerTextComponent } from './container-text.component';
import { ContainerWrapperComponent } from '../container/container-wrapper.component';
import { ContentService } from './../../services/content.service';
import { IdService } from '../id-service';
import { HDConfig } from '../../hd.config';

describe('ContainerTextComponent', () => {
  let component: ContainerTextComponent;
  let fixture: ComponentFixture<ContainerTextComponent>;

  beforeEach(async(() => {
    const contentServiceStub = {
      updateItem: function(path, value) {}
    };

    TestBed.configureTestingModule({
      declarations: [
        ContainerTextComponent,
        ContainerWrapperComponent,
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: ContentService, useValue: contentServiceStub },
        HDConfig,
        IdService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTextComponent);
    component = fixture.componentInstance;

    jasmine.clock().install();

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should debounce text input notifications by 300ms', () => {
    testDebounce();
  });

  it('should debounce text area notifications by 300ms', () => {
    component.istextarea = true;
    testDebounce();
  });

  function testDebounce() {
    const contentServiceSpy = spyOn(TestBed.get(ContentService), 'updateItem');
    const inputElement = fixture.debugElement.query(By.css('.js-content-input'));
    const new_value = 'new value';

    inputElement.nativeElement.value = new_value;
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    // component value should be changed and
    // due to debounce notify method should not be called yet
    expect(component.value.text).toBe(new_value);
    expect(contentServiceSpy).not.toHaveBeenCalled();
    jasmine.clock().tick(299);
    expect(contentServiceSpy).not.toHaveBeenCalled();
    jasmine.clock().tick(1);
    expect(contentServiceSpy).toHaveBeenCalled();
  }

  it('should use the validation function passed in validateWith parameter', () => {
    component.required = '';
    const inputErrorString = 'input should be ..';

    const validateWithErrorSpy = jasmine.createSpy('')
      .and.callFake(() => inputErrorString);

    const validateTrueSpy = jasmine.createSpy('')
      .and.callFake(() => '');

    const inputElement = fixture.debugElement.query(By.css('.js-content-input'));

    component.validateWith = validateWithErrorSpy;
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(validateWithErrorSpy).toHaveBeenCalled();
    expect(component.errorStr).toBe(inputErrorString);
    expect(component.isValid).toBeFalsy();

    component.validateWith = validateTrueSpy;
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(validateTrueSpy).toHaveBeenCalled();
    expect(component.errorStr).toBe('');
    expect(component.isValid).toBeTruthy();
  });

  it('should use default validate to 3 character length when validation function is not passed in', () => {
    component.required = '';
    const inputElement = fixture.debugElement.query(
                                              By.css('.js-content-input'));

    inputElement.nativeElement.value = 'ABC';
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component.isValid).toBeFalsy();
    expect(component.errorStr).toBe('value required');

    inputElement.nativeElement.value = 'ABCD';
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component.isValid).toBeTruthy();
    expect(component.errorStr).toBe('');
  });
});
