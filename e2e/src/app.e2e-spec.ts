import { browser, element, by } from 'protractor';
import { resolve } from 'path';

const page = {
  heroesListAddButton: element.all(by.css('app-heroes > div button')).get(0),
  heroesListInput: element(by.css('app-heroes > div input')),
  heroesListSearchButton: element.all(by.css('app-heroes > div button')).get(1),
  heroesListItems: element.all(by.css('app-heroes ul li')),
  logClearButton: element(by.css('app-messages button')),
  logList: element(by.css('app-messages ol')),
  logListItems: element.all(by.css('app-messages ol li')),
};

const checkLogForMessage = async (message: string) => {
  expect(await page.logList.getText()).toContain(message);
};

describe('Http Tests', () => {
  // It seems that currently Chrome/ChromeDriver fail to click a button that is just outside the
  // viewport (or maybe only partially inside the viewport) - at least in headless mode.
  // Possible solutions:
  // 1. Click the element via JavaScript (with something like
  //    `browser.executeScript('arguments[0].click', elem)`).
  // 2. Manually scroll the element into view before clicking:
  //    https://stackoverflow.com/questions/47776774/element-is-not-clickable-at-point-in-headless-mode-but-when-we-remove-headless
  // 3. Explicitly set the window size to a bigger size:
  //    https://stackoverflow.com/questions/62003082/elementnotinteractableexception-element-not-interactable-element-has-zero-size
  //
  // Since the default 800x600 window size in headless mode (as used on CI) causes the
  // `<app-config>` buttons to be in a position that trigger the above issue, we explicitly set the
  // window size to 1920x1080 when in headless mode.
  beforeAll(async () => {
    const config = await browser.getProcessedConfig();
    if (config.capabilities?.chromeOptions?.args?.includes('--headless')) {
      browser.driver.manage().window().setSize(1920, 1080);
    }
  });

  beforeEach(() => browser.get(''));

  describe('Heroes', () => {
    it('retrieves the list of heroes at startup', async () => {
      expect(await page.heroesListItems.count()).toBe(10);
      expect(await page.heroesListItems.get(0).getText()).toContain('Dr Nice');
    });
  });

  describe('Messages', () => {
    it('can clear the logs', async () => {
      expect(await page.logListItems.count()).toBe(1);
      await page.logClearButton.click();
      expect(await page.logListItems.count()).toBe(0);
    });
  });
  

});
