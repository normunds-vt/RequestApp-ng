import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

export const MAX_IMAGE_SIZE_PX = 600;
export const TEXT_CONTENT_DEBOUNCE_TIME = 350;
export const ERROR_MESSAGE_TIMEOUT = 5000;

export interface IContentAttachement {
  src: string;
  name: string;
}

@Component({
  selector: 'rf-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() content: string;
  @Input() attachements: IContentAttachement[] = [];

  @Input() infoStr = 'Enter description here.';
  @Input() desktopInfoStr =
    '\n\nTo attach images paste screen captures or other ' +
    'images from clipboard or drag and drop image files here or use upload button.';

  isDraggedOver: boolean;
  contentField: FormControl;
  onMobileDevice = true;
  error: string;

  @Input() onUpdate: (value: {
    content: string, attachements: IContentAttachement[]
  }) => void;

  ngOnInit() {
    if (!isMobileDevice()) {
      this.onMobileDevice = false;
      this.infoStr += this.desktopInfoStr;
    }
    this.contentField = new FormControl();
    this._subscribtion = this.contentField
      .valueChanges
      .pipe(debounceTime(TEXT_CONTENT_DEBOUNCE_TIME))
      .subscribe( value => {
        this.content = value;
        this.notifyChange();
    });
  }

  onPaste(event: ClipboardEvent) {
    getClipboardImage(event.clipboardData, this.addAttachement.bind(this));
  }

  onDragOver(event: DragEvent) {
    this.isDraggedOver = true;
    event.preventDefault();
    return false;
  }

  onDragLeave(event: DragEvent) {
    this.isDraggedOver = false;
    event.preventDefault();
    return false;
  }

  onDrop(event: DragEvent) {
    const files = event.dataTransfer && event.dataTransfer.files;
    event.preventDefault();
    event.stopPropagation();
    this.isDraggedOver = false;
    if (files && files.length) {
      processDroppedImageFiles(files, this.addAttachement.bind(this));
    }
  }

  onChangeFiles(event) {
    const files = event.target && event.target.files;
    if (files) {
      handleAndScaleImageFiles(files, MAX_IMAGE_SIZE_PX, (data) => {
        this.addAttachement({ dataURL: data });
      });
    }
  }

  rotateItem(item: IContentAttachement) {
    rotateImage(item.src)
      .then(result => {
        item.src = result;
        this.notifyChange();
      });
  }

  removeItem(item) {
    this.attachements = this.attachements.filter(
      attachement => attachement !== item
    );
    this.notifyChange();
  }

  addAttachement(data) {
    const { dataURL: src, name, error } = data;
    if (error) {
      this.setError(error);
    }
    if (src) {
      this.attachements = [...this.attachements, {
        src,
        name: name || 'Clipboard image'
      }];
      this.notifyChange();
    }
  }

  notifyChange() {
    const { onUpdate, content, attachements } = this;
    if (onUpdate) {
      onUpdate({ content, attachements });
    }
  }

  setError(error) {
    this.error = error;
    this._timeout = setTimeout(() => this.clearError(), ERROR_MESSAGE_TIMEOUT);
  }

  clearError() {
    this.error = '';
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  ngOnDestroy() {
    this._subscribtion.unsubscribe();
  }

  private _subscribtion: Subscription;
  private _timeout: any;
}

// -------------------------------------------------------------------
// utility functions
// -------------------------------------------------------------------
// export function getPlatform() {
//   return (typeof navigator === 'undefined' || /Win/i.test(navigator.platform))
//   ? 'Win'
//   : 'Mac';
// }

function isMobileDevice() {
  return (window && typeof window.orientation !== 'undefined') ||
        (navigator && navigator.userAgent.indexOf('IEMobile') !== -1);
}

// -------------------------------------------------------------------
// file processing functions
// -------------------------------------------------------------------
export function processDroppedImageFiles(files, cb) {
  Array.prototype.forEach.call(files, (file: File) => {
    if (!/image/.test(file.type)) {
      cb({ error: `Dropped file ${ file.name } is not image file` });
      return;
    }
    // getImageFileDimensions(file)
    //   .then((result) => console.log('get image file dimensions', result));
    readFile(file).then(cb);
  });
}

export function getClipboardImage (clipboardData, cb) {
  const file = getClipboardImageFile(clipboardData);
  if (file) {
    readFile(file).then(cb);
  } else {
    cb({ text: clipboardData && clipboardData.getData('Text') });
  }
}

function getClipboardImageFile(clipboardData) {
  let file;
  Array.prototype.forEach.call(clipboardData.types, function (type, i) {
    const item = clipboardData.items[i];
    if (/image/.test(type) || /image/.test(item.type)) {
      file = item.getAsFile();
    }
  });
  return file;
}

function readFile(file: File): Promise<{
  dataURL: string,
  file: File,
  name: string,
 } | { error: any }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = evt => {
      resolve({ dataURL: evt.target['result'], file, name: file.name });
    };
    // reader.onerror = (error) => {
    //   resolve({ error, file });
    // };
    reader.readAsDataURL(file);
  });
}

function handleAndScaleImageFiles(files, maxSize = 1200, cb) {
  Array.prototype.forEach.call(files, (file) => {
    const img = new Image;
    img.src = URL.createObjectURL(file);
    img.onload = function() {
      const base64String = getImageDataUrl(img, maxSize);
      cb(base64String);
    };
  });
}

// drawing API functions
function getImageDataUrl(img, maxSize) {
  let { width, height } = img;
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  if (maxSize && (width > maxSize || height > maxSize)) {
    const widthRatio = maxSize / width;
    const heightRatio = maxSize / height;
    const ratio = Math.min(widthRatio, heightRatio);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;
  canvasContext.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL();
}

function rotateImage(imageSrc): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const canvasContext = canvas.getContext('2d');
      canvasContext.rotate(90 * Math.PI / 180);
      canvasContext.drawImage(img, 0, -img.height);
      resolve(canvas.toDataURL('image/png'));
    };
  });

  // const canvas = document.createElement('canvas');
  // canvas.width = img.height;
  // canvas.height = img.width;
  // const canvasContext = canvas.getContext('2d');
  // canvasContext.rotate(90 * Math.PI / 180);
  // canvasContext.drawImage(img, 0, -img.height);
  // return canvas.toDataURL('image/png');
}
