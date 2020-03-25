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
