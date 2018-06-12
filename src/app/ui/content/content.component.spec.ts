import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import {
  ContentComponent,
  TEXT_CONTENT_DEBOUNCE_TIME,
  ERROR_MESSAGE_TIMEOUT
} from './content.component';
import {
  getEmptyPngFile,
  imageBase64,
} from '../../utils/webFileApi_pngImageFile';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentComponent ],
      imports: [ ReactiveFormsModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should add isDraggedOver class when dragged over, and remove it when dragged out`, () => {
    const textElement: HTMLElement = fixture.debugElement.query(By.css('.content-text')).nativeElement;
    const textAreaElement: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const hasDragOverClass = () => textElement.classList.contains('dragged-over');

    expect(hasDragOverClass()).toBeFalsy('inital value');

    textAreaElement.dispatchEvent(new DragEvent('dragover'));
    fixture.detectChanges();
    expect(hasDragOverClass()).toBeTruthy('after dragover event');

    textAreaElement.dispatchEvent(new DragEvent('dragleave'));
    fixture.detectChanges();
    expect(hasDragOverClass()).toBeFalsy('after drag leave');
  });


  it(`on paste event containing image in clipboard should invoke passed in onUpdate function
      containing new attached clipboard image`, (done) => {
    const textAreaElement: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const fileName = 'test.png';
    const emptyImageFile = getEmptyPngFile({ fileName: null});
    let dataTransfer: any;
    try { dataTransfer = new DataTransfer(); } catch (e) { }
    // passing clipboardData is necessary to initiate clipboardData in Chrome, without it clipboard data is null
    // it has to do with new standards of ClipboardEventInit definition
    const pasteEvent = new ClipboardEvent('paste', { clipboardData:  dataTransfer } as ClipboardEventInit);
    pasteEvent.clipboardData.items.add(emptyImageFile);

    component.onUpdate = ({ attachements }) => {
      expect(attachements.length).toBe(1);
      const imageUrl = attachements[0].src;
      // test if valid valid image can be created from attachement src
      const image = new Image();
      image.src = imageUrl;
      image.onload = function() {
        expect(image.width).toBeGreaterThan(0);
        done();
      };
      image.onerror = function() {
        throw new Error('Failed to create image from attached file');
      };
    };
    textAreaElement.dispatchEvent(pasteEvent);
  });

  it(`on drop event containing image file should invoke passed in onUpdate function
      containing new attached image`, (done) => {
    const textAreaElement: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const fileName = 'test.png';
    const emptyImageFile = getEmptyPngFile({ fileName: null});
    let dataTransfer: any;
    try { dataTransfer = new DataTransfer(); } catch (e) { }
    // passing clipboardData is necessary to initiate clipboardData in Chrome, without it clipboard data is null
    // it has to do with new standards of ClipboardEventInit definition
    const dropEvent = new DragEvent('drop', { dataTransfer } );
    dropEvent.dataTransfer.items.add(emptyImageFile);

    component.onUpdate = ({ attachements }) => {
      expect(attachements.length).toBe(1);
      const imageUrl = attachements[0].src;
      // test creation of valid image from attachement src
      const image = new Image();
      image.src = imageUrl;
      image.onload = function() {
        expect(image.width).toBeGreaterThan(0);
        done();
      };
      image.onerror = function() {
        throw new Error('Failed to create image from attached file');
      };
    };
    textAreaElement.dispatchEvent(dropEvent);
  });

  it(`on file change event added image file should invoke passed in onUpdate function
      containing new attached image`, (done) => {
    const fileElement: any = fixture.debugElement.query(By.css('input[type=file]')).nativeElement;
    const fileName = 'test.png';
    const emptyImageFile = getEmptyPngFile({ fileName: null});

    component.onUpdate = ({ attachements }) => {
      expect(attachements.length).toBe(1);
      const imageUrl = attachements[0].src;
      // test creation of valid image from attachement src
      const image = new Image();
      image.src = imageUrl;
      image.onload = function() {
        expect(image.width).toBeGreaterThan(0);
        done();
      };
      image.onerror = function() {
        throw new Error('Failed to create image from attached file');
      };
    };
    component.onChangeFiles({ target: { files: [ emptyImageFile ]}});
  });

  it(`should debounce text content entries`, fakeAsync(() => {
    const textAreaElement: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const new_value = 'new value';
    textAreaElement.value = new_value;
    textAreaElement.dispatchEvent(new Event('input'));
    component.onUpdate = jasmine.createSpy('onUpdate');
    expect(component.onUpdate).not.toHaveBeenCalled();
    tick(TEXT_CONTENT_DEBOUNCE_TIME);
    expect(component.onUpdate).toHaveBeenCalled();
    expect(component.onUpdate).toHaveBeenCalledWith({ content: new_value, attachements: [] });
  }));

  it(`should allow to remove attachements`, () => {
    component.attachements = [ { src: '', name: 'file name.png'} ];
    fixture.detectChanges();
    expect(getByCss('.content-attachement__remove-button')).toBeTruthy();
    expect(getByCss('.content-attachment__image')).toBeTruthy();

    getByCss('.content-attachement__remove-button')
      .nativeElement.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(getByCss('.content-attachement__remove-button')).toBeFalsy();
    expect(getByCss('.content-attachment__image')).toBeFalsy();
  });

  it(`should allow to rotate attachements`, async () => {
    component.attachements = [{
      src: 'data:image/png;base64,' + imageBase64,
      name: 'file name.png'
    }];

    fixture.detectChanges();

    const rotateButton: HTMLElement = getByCss('.content-attachement__rotate-button').nativeElement;
    const image = getImage();
    await imageLoaded(image);

    const startingWidth = image.naturalWidth;
    const startingHeight = image.naturalHeight;

    expect(startingWidth).toBeTruthy();
    expect(startingHeight).toBeTruthy();
    expect(startingWidth).not.toBe(startingHeight);

    rotateButton.dispatchEvent(new MouseEvent('click'));

    component.onUpdate = async () => {
      // should start loading new image
      fixture.detectChanges();
      // wait until image is loaded
      await imageLoaded(image);
      // update image props
      fixture.detectChanges();
      const { naturalWidth: width, naturalHeight: height } = getImage();
      expect(width).toBe(startingHeight);
      expect(height).toBe(startingWidth);
    };

    function getImage(): HTMLImageElement {
      return getByCss('.content-attachment__image').nativeElement;
    }

    function imageLoaded(imageObj) {
      return new Promise(resolve => {
        imageObj.onload = () => resolve(imageObj);
      });
    }
  });

  // error condition handling
  it('should display error if dropped file is not valid image file', () => {
    const textAreaElement: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const fileName = 'test.png';
    const invalidImageFile = new File([], 'invalid file');
    let dataTransfer: any;
    try { dataTransfer = new DataTransfer(); } catch (e) { }
    // passing clipboardData is necessary to initiate clipboardData in Chrome, without it clipboard data is null
    // it has to do with new standards of ClipboardEventInit definition
    const dropEvent = new DragEvent('drop', { dataTransfer } );
    dropEvent.dataTransfer.items.add(invalidImageFile);

    textAreaElement.dispatchEvent(dropEvent);
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeTruthy();
  });

  it(`should be able to set and clear error messages`, () => {
    component.setError('test error message');
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeTruthy();

    component.clearError();
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeFalsy();
  });

  it(`should keep error message displayed for ${ERROR_MESSAGE_TIMEOUT} milliseconds`, fakeAsync(() => {
    component.setError('test error message');
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeTruthy();

    tick(ERROR_MESSAGE_TIMEOUT - 1);
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeTruthy();

    tick(1);
    fixture.detectChanges();
    expect(getByCss('.content-attachments__error')).toBeFalsy();
  }));

  it(`shuld provide different copy instructions for Windows and Mac users`, () => {

    const originalPlatform = navigator.platform;
    function setNavigatorPlatfromTo(value) {
      Object.defineProperty(navigator, 'platform', {
        get: function () { return value; }
      });
    }

    function resetPlatform() {
      Object.defineProperty(navigator, 'platform', {
        get: function () { return originalPlatform; }
      });
    }
  });

  function getByCss(value) {
    return fixture.debugElement.query(By.css(value));
  }
});
