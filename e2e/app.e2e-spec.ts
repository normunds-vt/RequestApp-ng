import { DemoPage } from './demo.po';
import { browser, Key } from 'protractor';

const timeoutLength = 400;
function pause(len = timeoutLength) { browser.sleep(len); }
function longPause() { pause(1000); }
describe('hd-ng5 App', () => {
  const demoPage = new DemoPage();

  beforeAll(() => {
  });

  beforeEach(async() => {
    // demoPage.resetRequest();
    await demoPage.navigateTo();
    const title = 'Conference Room Meeting Setup';
    demoPage.initParent(`[title='${title}']`);
    // pause(12000);
  });

  it('should display welcome message', () => {
    expect(demoPage.appTitleEl.getText())
      .toBe('Request App');
  });

  fit('should be able to submit Conference Room Meeting Setup using keyboard entries', async () => {
    const title = 'Conference Room Meeting Setup';
    const container = demoPage.getContainer(title, 'content');
    await demoPage.resetRequest();
    expect(container.isDisplayed()).toBeFalsy();

    await demoPage.selectItem(title);
    expect(container.isDisplayed()).toBeTruthy();

    demoPage.updateProjectNumber('218011-B');

    demoPage.getDts(container).sendKeys('2018-03-01');
    // focus on from room and select 10'th item
    sendKeys(Key.TAB);
    sendKeys(Key.ARROW_DOWN, 11);
    sendKeys(Key.SPACE);
    // focus on to time and select second item
    sendKeys(Key.TAB);
    sendKeys(Key.ARROW_DOWN, 4);  // 4 slots - 2 hours
    sendKeys(Key.SPACE);
    // select second room
    sendKeys(Key.TAB, 2);
    sendKeys(Key.SPACE);

    // move to project number and update it to 218011-A
    sendKeys(Key.TAB, 6);
    sendKeys('218011-A');

    // select IT request
    sendKeys(Key.TAB, 3);
    sendKeys(Key.SPACE);
    pause();
    // select Audio Conference Call
    sendKeys(Key.TAB, 3);
    sendKeys(Key.SPACE);

    // with international callers
    sendKeys('\t ');

    // from Italy
    sendKeys(Key.TAB);
    sendKeys('Italy');

    // add Projector
    sendKeys(Key.TAB, 2);
    sendKeys(Key.SPACE);
    // and Laser Pointer
    sendKeys(Key.TAB);
    sendKeys(Key.SPACE);

    // select Office Services Setup
    sendKeys(Key.TAB, 2);
    sendKeys(Key.SPACE);

    // set 12 attendees
    sendKeys(Key.TAB);
    sendKeys('12');

    // add Drink Cart with
    sendKeys(Key.TAB, 2);
    sendKeys(Key.SPACE);
    // still water
    sendKeys('\t ');
    // sparkling waater
    sendKeys('\t ');
    // regular coffee
    sendKeys('\t ');

    // submit form
    sendKeys(Key.TAB, 5);
    sendKeys(Key.RETURN);

    longPause();
    demoPage.openRequestsPanel_open();
    longPause();
    // view details of first item
    sendKeys('\t ');
    pause(1000);

    // hide details of first item and select it for edit
    longPause();
    sendKeys(' \t ');
    longPause();
    // update project number
    demoPage.updateProjectNumber('218011-A');

    browser.sleep(10000);
  });
});

function sendKeys(
    keyValue,
    count = 1, {
    inBetweenTimeout = 50,
    endTimeout = 550 } = {}
  ) {
  const arr = keyValue.length > 1
    ? keyValue.split('')
    : Array(count).fill('').map(_ => keyValue);
  arr.forEach((key) => {
    browser.actions().sendKeys(key).perform();
    if (inBetweenTimeout) { browser.sleep(inBetweenTimeout); }
  });
  if (endTimeout) { browser.sleep(endTimeout); }
}
