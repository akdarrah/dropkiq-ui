"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class BoundElement{constructor(e){this.element=e,this.isContenteditable=this.element.isContentEditable}caretPositionWithDocumentInfo(){return this.isContenteditable?this.caretPositionWithDocumentInfoForContenteditable():this.caretPositionWithDocumentInfoForInput()}setCaretPosition(e,t){if(this.isContenteditable){var n=document.createRange(),o=window.getSelection();n.setStart(t,0),n.collapse(!0),o.removeAllRanges(),o.addRange(n)}else this.element.setSelectionRange(e,e)}getCaretPosition(){if(this.isContenteditable){let e=window.getSelection().getRangeAt(0);return this.getContentEditableCaretPosition(e.startOffset)}{let e=this.element.selectionStart;return this.getTextAreaOrInputUnderlinePosition(this.element,e,!1)}}insertTextAtCaret(e){if(this.isContenteditable){if(this.previousRange){var t=window.getSelection();t.removeAllRanges(),t.addRange(this.previousRange),this.previousRange=null}return this.insertTextForContenteditable(e)}return this.insertTextForInput(e)}saveSelection(){if(this.isContenteditable){let e=window.getSelection().getRangeAt(0);this.previousRange=e.cloneRange()}}insertTextForContenteditable(e){var t,n;(n=(t=window.getSelection()).getRangeAt(0)).deleteContents();var o=document.createTextNode(e);return n.insertNode(o),n.selectNodeContents(o),n.collapse(!1),t.removeAllRanges(),t.addRange(n),o}insertTextForInput(e){var t=this.element,n=t.scrollTop,o=t.selectionStart,i=t.value.substring(0,o),r=t.value.substring(t.selectionEnd,t.value.length);return t.value=i+e+r,o+=e.length,t.selectionStart=o,t.selectionEnd=o,t.focus(),t.scrollTop=n,t}caretPositionWithDocumentInfoForInput(){let e=this.element.selectionStart,t=this.element.value;return{leftText:t.slice(0,e),selectionStart:e,rightText:t.slice(e,t.length),allText:t}}caretPositionWithDocumentInfoForContenteditable(){let e=window.getSelection().getRangeAt(0),t=e.cloneRange();t.setStart(this.element,0),t.setEnd(e.startContainer,e.startOffset);let n=this.captureRangeText(t),o=e.cloneRange();o.selectNodeContents(this.element),o.setStart(e.startContainer,e.startOffset);let i=this.captureRangeText(o);return{leftText:n,selectionStart:n.length,rightText:i,allText:n+i}}captureRangeText(e){let t=e.cloneContents(),n=document.createElement("div");n.setAttribute("style","position: absolute; left: -10000px; top: -10000px"),n.setAttribute("contenteditable","true"),n.appendChild(t),document.body.appendChild(n);let o=n.innerText;return n.remove(),o}getTextAreaOrInputUnderlinePosition(e,t,n){let o=null!==window.mozInnerScreenX,i=document.createElement("div");i.id="input-textarea-caret-position-mirror-div",document.body.appendChild(i);let r=i.style,l=window.getComputedStyle?getComputedStyle(e):e.currentStyle;r.whiteSpace="pre-wrap","INPUT"!==e.nodeName&&(r.wordWrap="break-word"),r.position="absolute",r.visibility="hidden",["direction","boxSizing","width","height","overflowX","overflowY","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch","fontSize","fontSizeAdjust","lineHeight","fontFamily","textAlign","textTransform","textIndent","textDecoration","letterSpacing","wordSpacing"].forEach(e=>{r[e]=l[e]}),o?(r.width=`${parseInt(l.width)-2}px`,e.scrollHeight>parseInt(l.height)&&(r.overflowY="scroll")):r.overflow="hidden",i.textContent=e.value.substring(0,t),"INPUT"===e.nodeName&&(i.textContent=i.textContent.replace(/\s/g," "));let s=document.createElement("span");s.textContent=e.value.substring(t)||".",i.appendChild(s);let a=e.getBoundingClientRect(),d=document.documentElement,c=(window.pageXOffset||d.scrollLeft)-(d.clientLeft||0),g=(window.pageYOffset||d.scrollTop)-(d.clientTop||0),u=0,p=0;u=a.top,p=a.left;let h={top:u+g+s.offsetTop+parseInt(l.borderTopWidth)+parseInt(l.fontSize)-e.scrollTop,left:p+c+s.offsetLeft+parseInt(l.borderLeftWidth)};return document.body.removeChild(i),h}getContentEditableCaretPosition(e){let t,n,o=`sel_${(new Date).getTime()}_${Math.random().toString().substr(2)}`,i=window.getSelection(),r=i.getRangeAt(0);n=document.createRange(),n.setStart(i.anchorNode,e),n.setEnd(i.anchorNode,e),n.collapse(!1),t=document.createElement("span"),t.id=o,t.appendChild(document.createTextNode("\ufeff")),n.insertNode(t),i.removeAllRanges(),i.addRange(r);let l=t.getBoundingClientRect(),s=document.documentElement,a=(window.pageXOffset||s.scrollLeft)-(s.clientLeft||0),d=(window.pageYOffset||s.scrollTop)-(s.clientTop||0),c=0,g=0;c=l.left,g=l.top;let u={left:c+a,top:g+t.offsetHeight+d};return t.parentNode.removeChild(t),u}}exports.BoundElement=BoundElement;