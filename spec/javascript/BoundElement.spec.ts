import { BoundElement } from '../../src/BoundElement';

jest.useFakeTimers();

describe('BoundElement#constructor', () => {
  it('can be initialized with a textarea', () => {
    let element = document.getElementById('dropkiq-example');
    let boundElement = new BoundElement(element, window, document);

    expect(boundElement.element).toBe(element);
    expect(boundElement.window).toBe(window);
    expect(boundElement.document).toBe(document);
    expect(boundElement.isContenteditable).toBe(undefined);
    expect(boundElement.isCodeMirror).toBe(false);
    expect(boundElement.cachedOnBlurRange).toBe(null);
  });

  it('can be initialized with an input', () => {
    let element = document.getElementById('dropkiq-input-example');
    let boundElement = new BoundElement(element, window, document);

    expect(boundElement.element).toBe(element);
    expect(boundElement.window).toBe(window);
    expect(boundElement.document).toBe(document);
    expect(boundElement.isContenteditable).toBe(undefined);
    expect(boundElement.isCodeMirror).toBe(false);
    expect(boundElement.cachedOnBlurRange).toBe(null);
  });

  it('can be initialized with a contenteditable div', () => {
    let element = document.getElementById('dropkiq-contenteditable-example');
    let boundElement = new BoundElement(element, window, document);

    expect(boundElement.element).toBe(element);
    expect(boundElement.window).toBe(window);
    expect(boundElement.document).toBe(document);

    // https://github.com/jsdom/jsdom/issues/1670
    // expect(boundElement.isContenteditable).toBe(true);

    expect(boundElement.isCodeMirror).toBe(false);
    expect(boundElement.cachedOnBlurRange).toBe(null);
  });
})

describe('BoundElement#setExpiringCachedOnBlurRange', () => {
  it('does nothing if isContenteditable is false', () => {
    let element = document.getElementById('dropkiq-example');
    let boundElement = new BoundElement(element, window, document);
    let fakeRange = {fake: "range"};

    boundElement.isContenteditable = false;

    expect(boundElement.cachedOnBlurRange).toBe(null);
    boundElement.setExpiringCachedOnBlurRange(fakeRange);
    expect(boundElement.cachedOnBlurRange).toBe(null);
  });

  it('sets cachedOnBlurRange if isContenteditable is true', () => {
    let element = document.getElementById('dropkiq-contenteditable-example');
    let boundElement = new BoundElement(element, window, document);
    let fakeRange = {fake: "range"};

    boundElement.isContenteditable = true;

    expect(boundElement.cachedOnBlurRange).toBe(null);
    boundElement.setExpiringCachedOnBlurRange(fakeRange);
    expect(boundElement.cachedOnBlurRange).toStrictEqual(fakeRange);
  });

  it('unsets cachedOnBlurRange after 100 ms', () => {
    let element = document.getElementById('dropkiq-contenteditable-example');
    let boundElement = new BoundElement(element, window, document);
    let fakeRange = {fake: "range"};

    boundElement.isContenteditable = true;

    expect(boundElement.cachedOnBlurRange).toBe(null);
    boundElement.setExpiringCachedOnBlurRange(fakeRange);
    expect(boundElement.cachedOnBlurRange).toStrictEqual(fakeRange);

    jest.runAllTimers();
    expect(boundElement.cachedOnBlurRange).toStrictEqual(null);
  });
})

describe('BoundElement#getRowAndColumnForPosition', () => {
  it('handles the most basic case', () => {
    let element = document.getElementById('dropkiq-example');
    let boundElement = new BoundElement(element, window, document);

    let text     = "Testinggg"
    let position = 0;
    let result   = boundElement['getRowAndColumnForPosition'](text, position);

    expect(result.row).toBe(0);
    expect(result.column).toBe(0);
  });

  it('handles when the cursor is in another position', () => {
    let element = document.getElementById('dropkiq-example');
    let boundElement = new BoundElement(element, window, document);

    let text     = "Testinggg"
    let position = 5;
    let result   = boundElement['getRowAndColumnForPosition'](text, position);

    expect(result.row).toBe(0);
    expect(result.column).toBe(5);
  });

  it('works when there are multiple lines', () => {
    let element = document.getElementById('dropkiq-example');
    let boundElement = new BoundElement(element, window, document);

    let text     = "Testinggg\nTest"
    let position = 12;
    let result   = boundElement['getRowAndColumnForPosition'](text, position);

    expect(result.row).toBe(1);
    expect(result.column).toBe(2);
  });
})
