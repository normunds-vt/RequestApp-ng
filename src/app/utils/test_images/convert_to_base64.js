const fs = require('fs');

const imageAsBase64 = fs.readFileSync('./empty_704×396.png', 'base64');

const fileContent = 
  "// tslint:disable-next-line:max-line-length\n" +
  "const base64File = '" + imageAsBase64 + "';\n" +
  "export default base64File;\n";

fs.writeFile('./empty_704x396.png_base64.ts', fileContent, (error) => {
  if (error) console.error("Error: ", error);
});