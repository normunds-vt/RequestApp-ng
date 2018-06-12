import { imageBase64, getEmptyPngFile } from './webFileApi_pngImageFile';

describe('Test that getEmptyPngFile function', () => {

  it('should return file of image file, that should be able to provide source for valid image', () => {
    const file = getEmptyPngFile();

    const img = new Image();

    img.onload = () => {
      // console.log('image size', img.width, img.height);
      expect(img.width).toBeTruthy();
      expect(img.height).toBeTruthy();
    };

    img.onerror = () => { throw new Error('Image load error'); };
    img.src = URL.createObjectURL(file);
  });

  it('should return file of image file, that should be able to provide source for valid image functional version', () => {
    const file = getEmptyPngFile({ functional: true });

    const img = new Image();

    img.onload = () => {
      // console.log('image size', img.width, img.height);
      expect(img.width).toBeTruthy();
      expect(img.height).toBeTruthy();
    };

    img.onerror = () => { throw new Error('Image load error'); };
    img.src = URL.createObjectURL(file);
  });

  it('should respect provided fileName', () => {
    const fileName = 'test.png';
    const file = getEmptyPngFile({ fileName });
    expect(file.name).toBe(fileName);

    const fileFunctional = getEmptyPngFile({ fileName, functional: true });
    expect(fileFunctional.name).toBe(fileName);

    expect(file.size).toBe(fileFunctional.size);
  });
});
