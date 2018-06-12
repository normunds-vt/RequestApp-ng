// tslint:disable-next-line:max-line-length
export const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==';
// export default imageBase64;

// interpretation of https://github.com/jcblw/image-to-blob/blob/master/index.js
function image64ToFile_fast(base64image, fileName) {
  const byteString = atob(base64image);
  const mimeType = 'image/png';

  // write the bytes of the string to a typed array
  const typedArray = new Uint8Array( byteString.length );
  for (let i = 0; i < byteString.length; i++ ) {
    typedArray[i] = byteString.charCodeAt(i);
  }

  return new File([typedArray], fileName, { type: mimeType } );
}

// functional approach likely slower but more readable
export function image64ToFile_functional(base64image, fileName) {
  const type = 'image/png';

  return new File([
    new Uint8Array(atob(imageBase64).split('').map(b => b.charCodeAt(0)))
  ], fileName, { type } );
}


export function getEmptyPngFile({ fileName = 'empty.png', functional = false } = {}) {
  return functional
    ? image64ToFile_fast(imageBase64, fileName)
    : image64ToFile_functional(imageBase64, fileName);
}
