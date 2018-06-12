import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  get appTitle() {
    return element('.app-title').getText();
  }

  getParagraphText() {
    return element(by.css('vt-root h1')).getText();
  }
}
