"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const{DropkiqEngine:DropkiqEngine}=require("dropkiq"),BoundElement_1=require("./BoundElement"),tippy_js_1=require("tippy.js");class DropkiqUI{constructor(e,t,i,s,n="",o={}){this.schema=t,this.context=i,this.scope=s,this.licenseKey=n,this.options=o,this.showPreviews="function"==typeof o.showPreviews?o.showPreviews:()=>!0,this.showHints="function"==typeof o.showHints?o.showHints:()=>!0,this.suggestionFilter="function"==typeof o.suggestionFilter?o.suggestionFilter:()=>{},this.onRender="function"==typeof o.onRender?o.onRender:()=>{},this.iframe=o.iframe,this.iframe?(this.window=this.iframe.contentWindow,this.document=this.window.document):(this.window=window,this.document=document),this.element=e,this.isCodeMirror="object"==typeof this.element.doc,this.boundElement=new BoundElement_1.BoundElement(this.element,this.window,this.document),this.dropkiqEngine=new DropkiqEngine("",0,t,i,s,this.licenseKey,{suggestionFilter:this.suggestionFilter}),this.suggestionsArray=[],this.result={},this.caretOffset={},this.pathSchema=[],this.$poweredByDropkiq=document.createElement("div"),this.$poweredByDropkiq.style.display="none",this.$poweredByDropkiq.style.padding="5px",this.$poweredByDropkiq.style.height="24px",this.$poweredByDropkiq.style.color="#666666",this.$poweredByDropkiq.style["font-size"]="10px",this.$poweredByDropkiq.style.background="rgba(240,240,240,0.9)",this.$poweredByDropkiq.style["text-align"]="right";let r=document.createTextNode("Powered by"),l=document.createElement("img");l.setAttribute("src","https://app.dropkiq.com/plugin/dropkiq-sm.png"),l.style.width="48px",l.style.height="10px",l.style["margin-left"]="3px",this.$poweredByDropkiq.appendChild(r),this.$poweredByDropkiq.appendChild(l),this.$paywall=document.createElement("div"),this.$paywall.style["font-size"]="14px",this.$paywall.style.padding="10px",this.$paywall.style.color="#666666",this.$paywall.display="none",this.$ul=document.createElement("ul"),this.$header=document.createElement("div"),this.$header.setAttribute("class","dropkiq-header"),this.$div=document.createElement("div"),this.$div.setAttribute("id","dropkiq-autosuggest-menu"),this.$div.appendChild(this.$header),this.$div.appendChild(this.$ul),this.$div.appendChild(this.$paywall),this.$div.appendChild(this.$poweredByDropkiq),document.body.appendChild(this.$div);let h=this;h.documentCallback=function(){h.closeMenu()};let a=function(e){if(h.suggestionsArray.length){let t;switch(e.keyCode){case 27:return h.closeMenu(),e.preventDefault(),!1;case 38:return h.scrollToPrevious(),e.preventDefault(),!1;case 40:return h.scrollToNext(),e.preventDefault(),!1;case 9:case 13:return t=h.suggestionsArray.find((function(e){return e.active})),h.insertSuggestion(t),e.preventDefault(),!1}}setTimeout((function(){let t=h.boundElement.caretPositionWithDocumentInfo(),i=t.selectionStart,s=t.leftText,n=t.rightText,o=s.slice(-2);if(219!=e.keyCode||!e.shiftKey||"{"!=o[1]&&"{"!=o){if(53==e.keyCode&&e.shiftKey&&"{%"==o&&/^(\s+)?\}(.+)?/.test(n)){let e=h.boundElement.insertTextAtCaret("%");h.boundElement.setCaretPosition(i,e),h.element.focus()}}else{let e=h.boundElement.insertTextAtCaret("}");h.boundElement.setCaretPosition(i,e),h.element.focus()}}),25),d(e)},d=function(e){e.stopImmediatePropagation(),setTimeout((function(){h.findResults.apply(h)}),25)};this.isCodeMirror?(this.element.on("keydown",(function(e,t){a(t)})),this.element.on("mousedown",(function(e,t){d(t)})),this.element.on("focus",(function(e,t){d(t)}))):(this.element.addEventListener("keydown",a),this.element.addEventListener("click",d),this.element.addEventListener("focus",d))}closeMenu(){this.removeDocumentEventListeners(),this.suggestionsArray=[],this.renderSuggestions()}removeDocumentEventListeners(){document.removeEventListener("click",this.documentCallback),this.document&&this.document!==document&&this.document.removeEventListener("click",this.documentCallback)}renderSuggestions(){let e,t=this.result.prefix;if(this.$paywall.innerHTML="",this.$paywall.style.display="none",this.$header.innerHTML="",this.$header.style.display="none",this.$poweredByDropkiq.style.display="none",this.dropkiqEngine.authorizer.authorized()||(this.$poweredByDropkiq.style.display="block"),this.pathSchema&&(e=this.pathSchema[this.pathSchema.length-1]),e&&"ColumnTypes::HasOne"===e.type){let t="https://app.dropkiq.com/plugin/object.png",i=document.createElement("img");i.setAttribute("src",t),i.setAttribute("class","icon"),i.setAttribute("width","16px"),i.setAttribute("height","16px");let s=document.createElement("span");s.textContent=e.name,this.$header.appendChild(i),this.$header.appendChild(s),this.$header.style.display="block"}this.$div.style.top=`${this.caretOffset.top}px`,this.$div.style.left=`${this.caretOffset.left}px`,this.suggestionsArray.length?this.$div.style.display="block":this.$div.style.display="none",this.$ul.innerHTML="";let i=this;this.suggestionsArray.forEach((function(e){let s=document.createElement("li"),n=e.iconImageURLForSuggestion,o=document.createElement("img");o.setAttribute("src",n),o.setAttribute("class","icon"),o.setAttribute("width","16px"),o.setAttribute("height","16px");let r=document.createElement("div");r.setAttribute("class","first-line");let l=document.createElement("div");l.setAttribute("class","extra");let h=document.createElement("span"),a=document.createElement("img");if(a.setAttribute("class","right-arrow"),a.setAttribute("src","https://app.dropkiq.com/plugin/next-level.png"),r.appendChild(o),r.appendChild(a),t){let i=document.createElement("strong");i.textContent=t;let s=e.name;h.textContent=s.slice(t.length,s.length),r.appendChild(i)}else h.textContent=e.name;if(r.appendChild(h),s.appendChild(r),s.setAttribute("title",i.suggestionTitleText(e)),e.hint&&i.showHints()){let t=document.createElement("div");t.setAttribute("class","hint-icon"),t.setAttribute("data-tippy-content",e.hint),t.setAttribute("title","");let i="https://app.dropkiq.com/plugin/question-circle.png",n=document.createElement("img");n.setAttribute("src",i),t.appendChild(n),s.appendChild(t)}if(e.preview&&i.showPreviews()){let t=document.createElement("p");t.textContent="OUTPUT";let i=document.createElement("samp");i.textContent=e.preview,l.appendChild(t),l.appendChild(i),s.appendChild(l)}e.active&&s.classList.add("active"),i.$ul.appendChild(s),s.addEventListener("click",(function(t){i.insertSuggestion(e)}))}));let s=this.$ul.querySelector(".active");if(s&&(this.$ul.scrollTop=s.offsetTop-50),e&&"ColumnTypes::HasOne"===e.type&&!this.dropkiqEngine.authorizer.authorized()){this.$ul.innerHTML="",this.$paywall.style.display="block";let e=document.createElement("p"),t=this.suggestionsArray[0];t&&(e.textContent=t.hint),this.$paywall.appendChild(e);let i=document.createElement("p"),s=document.createElement("a");s.textContent="Purchase to unlock",s.setAttribute("href","http://dropkiq.com"),i.appendChild(s),this.$paywall.appendChild(i)}i.removeDocumentEventListeners(),document.addEventListener("click",i.documentCallback),i.document&&i.document!==document&&i.document.addEventListener("click",i.documentCallback),tippy_js_1.default(".hint-icon")}findResults(){let e=this.boundElement.caretPositionWithDocumentInfo();if(this.caretOffset=this.boundElement.getCaretPosition(),this.iframe){var t=this.iframe.getBoundingClientRect();this.caretOffset.top=this.caretOffset.top+t.top,this.caretOffset.left=this.caretOffset.left+t.left}try{this.result=this.dropkiqEngine.update(e.allText,e.selectionStart)}catch(e){if("ParseError"===e.name)return!1;throw e}this.onRender(this.result.renderedDocument),this.pathSchema=this.result.pathSchema;this.suggestionsArray=this.result.suggestionsArray||[],this.suggestionsArray.length>0&&(this.suggestionsArray[0].active=!0),this.renderSuggestions()}insertSuggestion(e){let t=this.result.prefix,i=e.name,s=i.slice(t.length,i.length);"ColumnTypes::HasOne"===e.type&&(s+="."),this.boundElement.insertTextAtCaret(s),this.boundElement.setFocus(),this.closeMenu();let n=this;setTimeout((function(){n.findResults.apply(n)}),25)}scrollToNext(){let e=this.suggestionsArray.find((function(e,t){return e.active})),t=this.suggestionsArray.indexOf(e);this.suggestionsArray[t].active=!1,this.suggestionsArray[t+1]?this.suggestionsArray[t+1].active=!0:this.suggestionsArray[0].active=!0,this.renderSuggestions()}scrollToPrevious(){let e=this.suggestionsArray.find((function(e,t){return e.active})),t=this.suggestionsArray.indexOf(e);this.suggestionsArray[t].active=!1,this.suggestionsArray[t-1]?this.suggestionsArray[t-1].active=!0:this.suggestionsArray[this.suggestionsArray.length-1].active=!0,this.renderSuggestions()}suggestionTitleText(e){let t=[e.name];return e.preview&&t.push(`**OUTPUT** ${e.preview}`),e.hint&&t.push(`**HINT** ${e.hint}`),t.join(" ")}}exports.DropkiqUI=DropkiqUI;