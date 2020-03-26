export class BoundElement {
  public element: any;
  public window: any;
  public document: any;
  public isContenteditable: boolean;
  public isCodeMirror: boolean;
  public isAceEditor: boolean;
  public cachedOnBlurRange: any;

  constructor(element, window, document) {
    this.element = element;
    this.window = window;
    this.document = document;
    this.isContenteditable = this.element.isContentEditable;
    this.isCodeMirror = typeof(this.element['doc']) === 'object';
    this.isAceEditor  = typeof(this.element['renderer']) === 'object';
    this.cachedOnBlurRange = null;
  }

  public setFocus() {
    if (this.isCodeMirror){
      this.element.focus();
    } else {
      let event = new Event('focus');
      this.element.dispatchEvent(event);
    }
  }

  public caretPositionWithDocumentInfo(): object {
    if (this.isCodeMirror){
      return this.caretPositionWithDocumentInfoForCodeMirror();
    } else if (this.isAceEditor){
      return this.caretPositionWithDocumentInfoForAceEditor();
    } else if (this.isContenteditable){
      return this.caretPositionWithDocumentInfoForContenteditable();
    } else {
      return this.caretPositionWithDocumentInfoForInput();
    }
  }

  // position is for input, textNode is for contenteditable
  public setCaretPosition(position, textNode){
    if (this.isCodeMirror){
      var text       = this.element.getValue();
      var slicedText = text.slice(0, position);
      var splitText  = slicedText.split(/\r?\n/);
      var line       = (splitText.length - 1);
      var column     = splitText[line].length;

      this.element.doc.setCursor({line: line, ch: column});
    } else if (this.isContenteditable){
      var range = this.document.createRange();
      var sel = this.window.getSelection();
      range.setStart(textNode, 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.element.setSelectionRange(position, position);
    }
  }

  public getCaretPosition(){
    if (this.isCodeMirror){
      let coords   = this.element.cursorCoords(true);
      let lineDiv  = this.element.display.lineDiv;
      let computed = this.window.getComputedStyle ? getComputedStyle(lineDiv) : lineDiv.currentStyle;
      let nextLine = (this.element.getCursor(true).line + 1);

      return {
        top: this.element.heightAtLine(nextLine),
        left: coords.left + parseInt(computed.borderLeftWidth)
      }
    } else if (this.isAceEditor) {
      let cursorRect = this.element.renderer.$cursorLayer.element.getElementsByClassName("ace_cursor")[0].getBoundingClientRect();

      return {
        top: cursorRect.top + cursorRect.height,
        left: cursorRect.left
      }
    } else if (this.isContenteditable){
      let selection = this.window.getSelection();
      let range = selection.getRangeAt(0);
      return this.getContentEditableCaretPosition(range.startOffset);
    } else {
      let caretPosition = this.element.selectionStart;
      return this.getTextAreaOrInputUnderlinePosition(this.element, caretPosition, false);
    }
  }

  public insertTextAtCaret(text){
    if (this.isCodeMirror){
      let coords = this.element.getCursor(true);
      this.element.doc.replaceRange(text, coords, coords);
    } else if (this.isContenteditable){
      return this.insertTextForContenteditable(text)
    } else {
      return this.insertTextForInput(text)
    }
  }

  public setExpiringCachedOnBlurRange(range: any){
    let that = this;

    if (this.isContenteditable){
      this.cachedOnBlurRange = range;

      setTimeout(function(){
        that.cachedOnBlurRange = null;
      }, 200);
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  private insertTextForContenteditable(text) {
    var sel, range, html;
    sel = this.window.getSelection();

    if(this.cachedOnBlurRange){
      range = this.cachedOnBlurRange;
      this.cachedOnBlurRange = null;
    } else {
      range = sel.getRangeAt(0);
    }

    range.deleteContents();
    var textNode = this.document.createTextNode(text);
    range.insertNode(textNode);
    range.selectNodeContents(textNode)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)

    return textNode;
  }

  private insertTextForInput(text) {
    var textarea = this.element;
    var scrollPos = textarea.scrollTop;
    var caretPos = textarea.selectionStart;

    var front = (textarea.value).substring(0, caretPos);
    var back = (textarea.value).substring(textarea.selectionEnd, textarea.value.length);
    textarea.value = front + text + back;
    caretPos = caretPos + text.length;
    textarea.selectionStart = caretPos;
    textarea.selectionEnd = caretPos;
    textarea.focus();
    textarea.scrollTop = scrollPos;

    return textarea;
  }

  public caretPositionWithDocumentInfoForInput(): object {
    let selectionStart = this.element.selectionStart;
    let value = this.element.value;
    let leftText = value.slice(0, selectionStart);
    let rightText = value.slice(selectionStart, value.length);

    return {
      leftText: leftText,
      selectionStart: selectionStart,
      rightText: rightText,
      allText: value
    }
  }

  public caretPositionWithDocumentInfoForContenteditable(): object {
    let selection = this.window.getSelection();
    let range = selection.getRangeAt(0);

    // Left
    let leftRange = range.cloneRange();
    leftRange.setStart(this.element, 0);
    leftRange.setEnd(range.startContainer, range.startOffset);
    let leftText = this.captureRangeText(leftRange);

    // Right
    let rightRange = range.cloneRange();
    rightRange.selectNodeContents(this.element);
    rightRange.setStart(range.startContainer, range.startOffset);
    let rightText = this.captureRangeText(rightRange);

    return {
      leftText: leftText,
      selectionStart: leftText.length,
      rightText: rightText,
      allText: (leftText + rightText)
    }
  }

  public caretPositionWithDocumentInfoForAceEditor(): object {
    let value  = this.element.getValue();
    let cursor = this.element.getCursorPosition()
    let row    = cursor.row;
    let column = cursor.column;

    return this.caretPositionWithDocumentInfoForValueRowAndColumn(value, row, column);
  }

  public caretPositionWithDocumentInfoForCodeMirror(): object {
    let value          = this.element.getValue();
    let cursor         = this.element.getCursor(true);
    let row            = cursor.line;
    let column         = cursor.ch;

    return this.caretPositionWithDocumentInfoForValueRowAndColumn(value, row, column);
  }

  private caretPositionWithDocumentInfoForValueRowAndColumn(value, row, column): object {
    let leftTextArray  = [];
    let rightTextArray = [];

    value.split(/\r?\n/).forEach(function(text, index){
      if(index < row){
        leftTextArray.push(text);
      } else if (index === row){
        leftTextArray.push(text.slice(0, column));
        rightTextArray.push(text.slice(column, text.length));
      } else if (index > row){
        rightTextArray.push(text);
      }
    });

    let leftText = leftTextArray.join("\n");
    let rightText = rightTextArray.join("\n");

    return {
      leftText: leftText,
      selectionStart: leftText.length,
      rightText: rightText,
      allText: (leftText + rightText)
    }
  }

  private captureRangeText(range): string {
    let documentFragment = range.cloneContents();

    let elemClone = this.document.createElement("div");
    elemClone.setAttribute('style', "position: absolute; left: -10000px; top: -10000px");
    elemClone.setAttribute('contenteditable', 'true');

    elemClone.appendChild(documentFragment);
    this.document.body.appendChild(elemClone);
    let captureText = elemClone.innerText;
    elemClone.remove();

    return captureText;
  }

  private getTextAreaOrInputUnderlinePosition(element, position, flipped) {
      let properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX',
          'overflowY', 'borderTopWidth', 'borderRightWidth',
          'borderBottomWidth', 'borderLeftWidth', 'paddingTop',
          'paddingRight', 'paddingBottom', 'paddingLeft',
          'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch',
          'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
          'textAlign', 'textTransform', 'textIndent',
          'textDecoration', 'letterSpacing', 'wordSpacing'
      ]

      let isFirefox = (this.window['mozInnerScreenX'] !== null)

      let div = this.document.createElement('div')
      div.id = 'input-textarea-caret-position-mirror-div'
      this.document.body.appendChild(div)

      let style = div.style
      let computed = this.window.getComputedStyle ? getComputedStyle(element) : element.currentStyle

      style.whiteSpace = 'pre-wrap'
      if (element.nodeName !== 'INPUT') {
          style.wordWrap = 'break-word'
      }

      // position off-screen
      style.position = 'absolute'
      style.visibility = 'hidden'

      // transfer the element's properties to the div
      properties.forEach(prop => {
          style[prop] = computed[prop]
      })

      if (isFirefox) {
          style.width = `${(parseInt(computed.width) - 2)}px`
          if (element.scrollHeight > parseInt(computed.height))
              style.overflowY = 'scroll'
      } else {
          style.overflow = 'hidden'
      }

      div.textContent = element.value.substring(0, position)

      if (element.nodeName === 'INPUT') {
          div.textContent = div.textContent.replace(/\s/g, ' ')
      }

      let span = this.document.createElement('span')
      span.textContent = element.value.substring(position) || '.'
      div.appendChild(span)

      let rect = element.getBoundingClientRect()
      let doc = this.document.documentElement
      let windowLeft = (this.window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      let windowTop = (this.window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

      let top = 0;
      let left = 0;
      // if (this.menuContainerIsBody) {
        top = rect.top;
        left = rect.left;
      // }

      let coordinates = {
          top: top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize) - element.scrollTop,
          left: left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth)
      }

      // let windowWidth = window.innerWidth
      // let windowHeight = window.innerHeight
      //
      // let menuDimensions = this.getMenuDimensions()
      // let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
      //
      // if (menuIsOffScreen.right) {
      //     coordinates.right = windowWidth - coordinates.left
      //     coordinates.left = 'auto'
      // }
      //
      // let parentHeight = this.tribute.menuContainer
      //     ? this.tribute.menuContainer.offsetHeight
      //     : this.getDocument().body.offsetHeight
      //
      // if (menuIsOffScreen.bottom) {
      //     let parentRect = this.tribute.menuContainer
      //         ? this.tribute.menuContainer.getBoundingClientRect()
      //         : this.getDocument().body.getBoundingClientRect()
      //     let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top)
      //
      //     coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top - span.offsetTop)
      //     coordinates.top = 'auto'
      // }
      //
      // menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
      // if (menuIsOffScreen.left) {
      //     coordinates.left = windowWidth > menuDimensions.width
      //         ? windowLeft + windowWidth - menuDimensions.width
      //         : windowLeft
      //     delete coordinates.right
      // }
      // if (menuIsOffScreen.top) {
      //     coordinates.top = windowHeight > menuDimensions.height
      //         ? windowTop + windowHeight - menuDimensions.height
      //         : windowTop
      //     delete coordinates.bottom
      // }

      this.document.body.removeChild(div)
      return coordinates
  }

  private getContentEditableCaretPosition(selectedNodePosition) {
      let markerTextChar = '﻿'
      let markerEl, markerId = `sel_${new Date().getTime()}_${Math.random().toString().substr(2)}`
      let range
      let sel = this.window.getSelection();
      let prevRange = sel.getRangeAt(0)

      range = this.document.createRange()
      range.setStart(sel.anchorNode, selectedNodePosition)
      range.setEnd(sel.anchorNode, selectedNodePosition)

      range.collapse(false)

      // Create the marker element containing a single invisible character using DOM methods and insert it
      markerEl = this.document.createElement('span')
      markerEl.id = markerId

      markerEl.appendChild(this.document.createTextNode(markerTextChar))
      range.insertNode(markerEl)
      sel.removeAllRanges()
      sel.addRange(prevRange)

      let rect = markerEl.getBoundingClientRect()
      let doc = this.document.documentElement
      let windowLeft = (this.window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      let windowTop = (this.window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

      let left = 0
      let top = 0
      // if (this.menuContainerIsBody) {
        left = rect.left
        top = rect.top
      // } else {
        // left = markerEl.offsetLeft;
        // top = markerEl.offsetTop;
      // }

      let coordinates = {
          left: left + windowLeft,
          top: top + markerEl.offsetHeight + windowTop
      }
      // let windowWidth = window.innerWidth
      // let windowHeight = window.innerHeight
      //
      // let menuDimensions = this.getMenuDimensions()
      // let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
      //
      // if (menuIsOffScreen.right) {
      //     coordinates.left = 'auto'
      //     coordinates.right = windowWidth - rect.left - windowLeft
      // }
      //
      // let parentHeight = this.tribute.menuContainer
      //     ? this.tribute.menuContainer.offsetHeight
      //     : this.getDocument().body.offsetHeight
      //
      // if (menuIsOffScreen.bottom) {
      //     let parentRect = this.tribute.menuContainer
      //         ? this.tribute.menuContainer.getBoundingClientRect()
      //         : this.getDocument().body.getBoundingClientRect()
      //     let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top)
      //
      //     coordinates.top = 'auto'
      //     coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top)
      // }
      //
      // menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
      // if (menuIsOffScreen.left) {
      //     coordinates.left = windowWidth > menuDimensions.width
      //         ? windowLeft + windowWidth - menuDimensions.width
      //         : windowLeft
      //     delete coordinates.right
      // }
      // if (menuIsOffScreen.top) {
      //     coordinates.top = windowHeight > menuDimensions.height
      //         ? windowTop + windowHeight - menuDimensions.height
      //         : windowTop
      //     delete coordinates.bottom
      // }

      markerEl.parentNode.removeChild(markerEl)
      return coordinates
  }
}
