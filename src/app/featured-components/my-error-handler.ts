import { ErrorHandler } from '@angular/core';

export default class MyErrorHandler extends ErrorHandler {

  constructor () {
    super();
  }
  handleError(error) {
    // send the error to the server
    // debugger;
    // delegate to the default handler
    super.handleError(error);
  }
}
