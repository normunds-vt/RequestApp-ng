import { browser, by, element, ElementFinder, $, $$, promise } from 'protractor';

export class DemoPage {
  parent: ElementFinder;

  navigateTo() {
    // browser.ignoreSynchronization = true;
    // browser.driver.sleep(3500);
    return browser.get('/');
  }

  initParent(cssString) {
    this.parent = $(cssString);
  }

  get appTitleEl() {
    return $('.app-title');
  }

  getCancelButton() {
    return this.parent.$('vt-form-actions .js-cancel');
  }

  getAllCancelButtons() {
    return $$('.js-cancel');
  }

  selectItem(title) {
    return this.getContainer(title, 'label')
      .click()
      .then(delay);
  }

  getContainer(title, part: 'label' | 'content' | '' = '') {
    const selectedPart = part
      .replace('content', ' > div > div > .container-select__content')
      .replace('label', ' > div > div > label');
    return $(`[title='${title}'] ${selectedPart}`);
  }

  getFromTime(parent: ElementFinder) {
    return parent.$$('.vt-dropdown-display').get(0);
  }

  getToTime(parent: ElementFinder) {
    return parent.$$('.vt-dropdown-display').get(1);
  }

  resetRequest() {
    return this.getAllCancelButtons()
      .filter(el => el.isDisplayed())
      .each(cancelButton => cancelButton.click());
  }

  getDts(parent: ElementFinder) {
    return parent.element(
      { css: '.datetimeslot__calendar input[type=text]'}
    );
  }

  openRequestsPanel_open() {
    const panelBody = $('open-requests .panel-collapsable__body');
    return panelBody
      .isDisplayed()
      .then(isOpen => $('open-requests .panel-collapsable__title').click())
      .then(() => panelBody);
  }


  updateProjectNumber(value) {
    console.log('parent', this.parent);
    return this.parent.$(' [title=\'Project Number:\'] input').sendKeys(value);
  }
}

function delay(val) {
  browser.sleep(400);
  return val;
}
