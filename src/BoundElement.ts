export class BoundElement {
  public element: any;
  public isContenteditable: boolean;
  public previousRange: any;

  constructor(element) {
    this.element = element;
    this.isContenteditable = this.element.isContentEditable;
  }

  public caretPositionWithDocumentInfo(): object {
    if (this.isContenteditable){
      return this.caretPositionWithDocumentInfoForContenteditable();
    } else {
      return this.caretPositionWithDocumentInfoForInput();
    }
  }

  // position is for input, textNode is for contenteditable
  public setCaretPosition(position, textNode){
    if (this.isContenteditable){
      var range = document.createRange();
      var sel = window.getSelection();
      range.setStart(textNode, 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.element.setSelectionRange(position, position);
    }
  }

  public getCaretPosition(){
    if (this.isContenteditable){
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      return this.getContentEditableCaretPosition(range.startOffset);
    } else {
      let caretPosition = this.element.selectionStart;
      return this.getTextAreaOrInputUnderlinePosition(this.element, caretPosition, false);
    }
  }

  public insertTextAtCaret(text){
    if (this.isContenteditable){
      if(this.previousRange){
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.previousRange);

        this.previousRange = null;
      }

      return this.insertTextForContenteditable(text)
    } else {
      return this.insertTextForInput(text)
    }
  }

  public saveSelection(){
    if (this.isContenteditable){
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);

      this.previousRange = range.cloneRange();
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  private insertTextForContenteditable(text) {
    var sel, range, html;
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    var textNode = document.createTextNode(text);
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
    let selection = window.getSelection();
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

  private captureRangeText(range): string {
    let documentFragment = range.cloneContents();

    let elemClone = document.createElement("div");
    elemClone.setAttribute('style', "position: absolute; left: -10000px; top: -10000px");
    elemClone.setAttribute('contenteditable', 'true');

    elemClone.appendChild(documentFragment);
    document.body.appendChild(elemClone);
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

      let isFirefox = (window['mozInnerScreenX'] !== null)

      let div = document.createElement('div')
      div.id = 'input-textarea-caret-position-mirror-div'
      document.body.appendChild(div)

      let style = div.style
      let computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle

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

      let span = document.createElement('span')
      span.textContent = element.value.substring(position) || '.'
      div.appendChild(span)

      let rect = element.getBoundingClientRect()
      let doc = document.documentElement
      let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

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

      document.body.removeChild(div)
      return coordinates
  }

  private getContentEditableCaretPosition(selectedNodePosition) {
      let markerTextChar = '﻿'
      let markerEl, markerId = `sel_${new Date().getTime()}_${Math.random().toString().substr(2)}`
      let range
      let sel = window.getSelection();
      let prevRange = sel.getRangeAt(0)

      range = document.createRange()
      range.setStart(sel.anchorNode, selectedNodePosition)
      range.setEnd(sel.anchorNode, selectedNodePosition)

      range.collapse(false)

      // Create the marker element containing a single invisible character using DOM methods and insert it
      markerEl = document.createElement('span')
      markerEl.id = markerId

      markerEl.appendChild(document.createTextNode(markerTextChar))
      range.insertNode(markerEl)
      sel.removeAllRanges()
      sel.addRange(prevRange)

      let rect = markerEl.getBoundingClientRect()
      let doc = document.documentElement
      let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

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
