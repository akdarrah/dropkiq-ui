const { DropkiqEngine } = require('dropkiq')
import { BoundElement } from './BoundElement'
import tippy from 'tippy.js';

export class DropkiqUI {
  public element: any;
  public isCodeMirror: boolean;
  public boundElement: BoundElement;
  public schema: object;
  public context: object;
  public scope: object;
  public licenseKey: string;

  public options: object;
  public showPreviews: Function;
  public showHints: Function;
  public suggestionFilter: Function;
  public onRender: Function;
  public iframe: any;
  public document: any;
  public window: any;

  private dropkiqEngine: any;
  private suggestionsArray: Array<object>;
  private result: object;
  private caretOffset: object;
  private pathSchema: [];
  private $ul: any;
  private $header: any;
  private $div: any;
  private $poweredByDropkiq: any;
  private $paywall: any;

  constructor(element, schema: object, context: object, scope: object, licenseKey: string = "", options: object = {}) {
    this.schema = schema;
    this.context = context;
    this.scope = scope;
    this.licenseKey = licenseKey;

    this.options          = options;
    this.showPreviews     = (typeof(options['showPreviews']) === 'function' ? options['showPreviews'] : () => true);
    this.showHints        = (typeof(options['showHints']) === 'function' ? options['showHints'] : () => true);
    this.suggestionFilter = (typeof(options['suggestionFilter']) === 'function' ? options['suggestionFilter'] : () => {});
    this.onRender         = (typeof(options['onRender']) === 'function' ? options['onRender'] : () => {});
    this.iframe           = options['iframe'];

    if(this.iframe){
      this.window   = this.iframe.contentWindow;
      this.document = this.window.document;
    } else {
      this.window   = window;
      this.document = document;
    }

    this.element = element;
    this.isCodeMirror = typeof(this.element['doc']) === 'object';
    this.boundElement = new BoundElement(this.element, this.window, this.document);

    this.dropkiqEngine = new DropkiqEngine("", 0, schema, context, scope, this.licenseKey, {suggestionFilter: this.suggestionFilter});
    this.suggestionsArray = [];
    this.result = {};
    this.caretOffset = {};
    this.pathSchema = [];

    this.$poweredByDropkiq = document.createElement("div");
    this.$poweredByDropkiq.style.display = "none";
    this.$poweredByDropkiq.style.padding = "5px";
    this.$poweredByDropkiq.style.height = "24px";
    this.$poweredByDropkiq.style.color = "#666666";
    this.$poweredByDropkiq.style['font-size'] = "10px";
    this.$poweredByDropkiq.style.background = "rgba(240,240,240,0.9)"
    this.$poweredByDropkiq.style['text-align'] = "right"
    let poweredByText = document.createTextNode("Powered by");
    let $dropkiqImg = document.createElement("img");
    $dropkiqImg.setAttribute('src', "https://app.dropkiq.com/plugin/dropkiq-sm.png")
    $dropkiqImg.style.width = "48px";
    $dropkiqImg.style.height = "10px";
    $dropkiqImg.style['margin-left'] = "3px";
    this.$poweredByDropkiq.appendChild(poweredByText);
    this.$poweredByDropkiq.appendChild($dropkiqImg);

    this.$paywall = document.createElement("div");
    this.$paywall.style['font-size'] = "14px"
    this.$paywall.style.padding = "10px"
    this.$paywall.style['color'] = "#666666"
    this.$paywall.display = "none"

    this.$ul = document.createElement("ul");
    this.$header = document.createElement("div");
    this.$header.setAttribute('class', 'dropkiq-header');
    this.$div = document.createElement("div")
    this.$div.setAttribute('id', 'dropkiq-autosuggest-menu');
    this.$div.appendChild(this.$header);
    this.$div.appendChild(this.$ul);
    this.$div.appendChild(this.$paywall);
    this.$div.appendChild(this.$poweredByDropkiq);
    document.body.appendChild(this.$div);

    let that = this;
    let menuControlCallback = function(e) {
      if(!that.suggestionsArray.length){
        return true;
      }

      let suggestion;
      switch (e.keyCode) {
        case 27: // Esc key
          that.closeMenu();
          e.stopImmediatePropagation();
          e.preventDefault();
          break;
        case 38: // up arrow
          that.scrollToPrevious();
          e.stopImmediatePropagation();
          e.preventDefault();
          break;
        case 40: // down arrow
          that.scrollToNext();
          e.stopImmediatePropagation();
          e.preventDefault();
          break;
        case 9: // tab
          suggestion = that.suggestionsArray.find(function(suggestion){
            return suggestion['active'];
          });
          that.insertSuggestion(suggestion);
          e.stopImmediatePropagation();
          e.preventDefault();
          break;
        case 13: // enter key
          suggestion = that.suggestionsArray.find(function(suggestion){
            return suggestion['active'];
          });
          that.insertSuggestion(suggestion);
          e.stopImmediatePropagation();
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    let findResultsCallback = function(e){
      e.stopImmediatePropagation();

      setTimeout(function(){
        that.findResults.apply(that);
      }, 25);
    }

    // Auto-complete {{}} and {%%}
    let autoCompleteCallback = function(e){
      e.stopImmediatePropagation();

      setTimeout(function(){
        let result = that.boundElement.caretPositionWithDocumentInfo();

        let selectionStart    = result['selectionStart'];
        let leftText          = result['leftText'];
        let rightText         = result['rightText'];
        let leftTwoCharacters = leftText.slice(-2);
        let closeTagPattern   = /^(\s+)?\}(.+)?/;

        if (e.keyCode == 219 && e.shiftKey && (leftTwoCharacters[1] == "{" || leftTwoCharacters == "{")){
          let textNode = that.boundElement.insertTextAtCaret("}");
          that.boundElement.setCaretPosition(selectionStart, textNode);
          that.element.focus();
        } else if (e.keyCode == 53 && e.shiftKey && leftTwoCharacters == "{%" && closeTagPattern.test(rightText)){
          let textNode = that.boundElement.insertTextAtCaret("%");
          that.boundElement.setCaretPosition(selectionStart, textNode);
          that.element.focus();
        }
      }, 25);

      findResultsCallback(e);
    };

    if(this.isCodeMirror){
      this.element.on('keydown', function(cm, e){ menuControlCallback(e); });
      this.element.on("mousedown", function(cm, e){ findResultsCallback(e); });
      this.element.on("focus", function(cm, e){ findResultsCallback(e); });
      this.element.on("keydown", function(cm, e){ autoCompleteCallback(e) });
    } else {
      this.element.addEventListener('keydown', menuControlCallback);
      this.element.addEventListener("click", findResultsCallback);
      this.element.addEventListener("focus", findResultsCallback);
      this.element.addEventListener("keydown", autoCompleteCallback);
    }
  }

  public closeMenu(){
    this.suggestionsArray = [];
    this.renderSuggestions();
  }

  private renderSuggestions(){
    let prefix = this.result['prefix'];

    this.$paywall.innerHTML = '';
    this.$paywall.style.display = 'none';

    this.$header.innerHTML = '';
    this.$header.style.display = 'none';

    this.$poweredByDropkiq.style.display = "none";
    if(!this.dropkiqEngine.authorizer.authorized()){
      this.$poweredByDropkiq.style.display = "block";
    }

    let lastPathNode;
    if(this.pathSchema){
      lastPathNode = this.pathSchema[this.pathSchema.length-1];
    }

    if(lastPathNode && lastPathNode.type === "ColumnTypes::HasOne"){
      let imgUrl = "https://app.dropkiq.com/plugin/object.png";
      let $icon = document.createElement("img");

      $icon.setAttribute('src', imgUrl);
      $icon.setAttribute('class', 'icon');
      $icon.setAttribute('width', '16px');
      $icon.setAttribute('height', '16px');

      let $text = document.createElement("span");
      $text.textContent = lastPathNode.name;

      this.$header.appendChild($icon);
      this.$header.appendChild($text);
      this.$header.style.display = "block";
    }

    this.$div.style.top = `${this.caretOffset['top']}px`;
    this.$div.style.left = `${this.caretOffset['left']}px`;

    if(this.suggestionsArray.length){
      this.$div.style.display = 'block';
    } else {
      this.$div.style.display = 'none';
    }
    this.$ul.innerHTML = '';

    let that = this;
    this.suggestionsArray.forEach(function(suggestion){
      let $li = document.createElement("li");

      let imgUrl = suggestion['iconImageURLForSuggestion'];
      let $icon = document.createElement("img");
      $icon.setAttribute('src', imgUrl);
      $icon.setAttribute('class', 'icon');
      $icon.setAttribute('width', '16px');
      $icon.setAttribute('height', '16px');

      let $entire = document.createElement("div");
      $entire.setAttribute('class', "first-line");

      let $extra = document.createElement("div");
      $extra.setAttribute('class', 'extra');
      let $remaining = document.createElement("span");
      let $arrowSpan = document.createElement("img");
      $arrowSpan.setAttribute('class', 'right-arrow');
      $arrowSpan.setAttribute('src', "https://app.dropkiq.com/plugin/next-level.png");

      $entire.appendChild($icon);
      $entire.appendChild($arrowSpan);

      if(prefix){
        let $strong = document.createElement("strong");

        $strong.textContent = prefix;
        let suggestionName = suggestion['name'];
        $remaining.textContent = (suggestionName.slice(prefix.length, suggestionName.length));
        $entire.appendChild($strong);
      } else {
        $remaining.textContent = suggestion['name'];
      }

      $entire.appendChild($remaining);
      $li.appendChild($entire);
      $li.setAttribute('title', that.suggestionTitleText(suggestion))

      if(suggestion['hint'] && that.showHints()){
        let $hintSpan = document.createElement("div");
        $hintSpan.setAttribute('class', 'hint-icon');
        $hintSpan.setAttribute("data-tippy-content", suggestion['hint']);
        $hintSpan.setAttribute("title", "");

        let imgUrl = "https://app.dropkiq.com/plugin/question-circle.png";
        let $hint = document.createElement("img");
        $hint.setAttribute('src', imgUrl);

        $hintSpan.appendChild($hint);
        $li.appendChild($hintSpan);
      }

      if(suggestion['preview'] && that.showPreviews()){
        let $head = document.createElement("p")
        $head.textContent = "OUTPUT";

        let $samp = document.createElement("samp");
        $samp.textContent = suggestion['preview'];

        $extra.appendChild($head);
        $extra.appendChild($samp);
        $li.appendChild($extra);
      }

      if(suggestion['active']){$li.classList.add("active");}
      that.$ul.appendChild($li);

      $li.addEventListener('click', function(e){
        that.insertSuggestion(suggestion);
      });
    });

    let activeLi = this.$ul.querySelector('.active');
    if(activeLi){
      this.$ul.scrollTop = (activeLi.offsetTop - 50);
    }

    if(lastPathNode && lastPathNode.type === "ColumnTypes::HasOne" && !this.dropkiqEngine.authorizer.authorized()){
      this.$ul.innerHTML = '';
      this.$paywall.style.display = 'block';

      let previewText = document.createElement('p');
      let dropkiqSuggestion = this.suggestionsArray[0];
      if(dropkiqSuggestion){
        previewText.textContent = dropkiqSuggestion['hint'];
      }
      this.$paywall.appendChild(previewText);

      let purchaseLinkP = document.createElement('p');
      let purchaseLink = document.createElement('a');
      purchaseLink.textContent = "Purchase to unlock"
      purchaseLink.setAttribute('href', "http://dropkiq.com")
      purchaseLinkP.appendChild(purchaseLink)
      this.$paywall.appendChild(purchaseLinkP);
    }

    let closeMenuAndStopListening = function(){
      that.closeMenu();

      document.removeEventListener('click', closeMenuAndStopListening);
      if(that.document !== document){
        that.document.removeEventListener('click', closeMenuAndStopListening);
      }
    }

    document.addEventListener('click', closeMenuAndStopListening);
    if(this.document !== document){
      this.document.addEventListener('click', closeMenuAndStopListening);
    }

    tippy('.hint-icon');
  }

  private findResults(){
    let result       = this.boundElement.caretPositionWithDocumentInfo();
    this.caretOffset = this.boundElement.getCaretPosition();

    if(this.iframe){
      var iframeRect = this.iframe.getBoundingClientRect();
      this.caretOffset['top'] = (this.caretOffset['top'] + iframeRect.top);
      this.caretOffset['left'] = (this.caretOffset['left'] + iframeRect.left);
    }

    try {
      this.result = this.dropkiqEngine.update(result['allText'], result['selectionStart']);
    } catch(error) {
      if (error.name === "ParseError") {
        return false;
      } else {
        throw error;
      }
    }

    this.onRender(this.result['renderedDocument']);
    this.pathSchema  = this.result['pathSchema'];
    let emptyArray: Array<Object> = [];
    this.suggestionsArray = this.result['suggestionsArray'] || emptyArray;

    if(this.suggestionsArray.length > 0){
      this.suggestionsArray[0]['active'] = true;
    }

    this.renderSuggestions();
  };

  private insertSuggestion(suggestion){
    let prefix = this.result['prefix'];
    let suggestionText = suggestion['name'];

    let textToEnter = suggestionText.slice(prefix.length, suggestionText.length);

    if(suggestion.type === "ColumnTypes::HasOne"){
      textToEnter = (textToEnter + ".");
    }

    this.boundElement.insertTextAtCaret(textToEnter);
    this.boundElement.setFocus();

    this.closeMenu();
  };

  private scrollToNext(){
    let activeSuggestion = this.suggestionsArray.find(function(suggestion, index){
      return suggestion['active'];
    });
    let activeIndex = this.suggestionsArray.indexOf(activeSuggestion);

    this.suggestionsArray[activeIndex]['active'] = false;

    if(this.suggestionsArray[activeIndex+1]){
      this.suggestionsArray[activeIndex+1]['active'] = true;
    } else {
      this.suggestionsArray[0]['active'] = true;
    }

    this.renderSuggestions();
  }

  private scrollToPrevious(){
    let activeSuggestion = this.suggestionsArray.find(function(suggestion, index){
      return suggestion['active'];
    });
    let activeIndex = this.suggestionsArray.indexOf(activeSuggestion);

    this.suggestionsArray[activeIndex]['active'] = false;

    if(this.suggestionsArray[activeIndex-1]){
      this.suggestionsArray[activeIndex-1]['active'] = true;
    } else {
      this.suggestionsArray[this.suggestionsArray.length-1]['active'] = true;
    }

    this.renderSuggestions();
  }

  private suggestionTitleText(suggestion): string{
    let suggestionTexts = [suggestion['name']];

    if(suggestion.preview){
      suggestionTexts.push(`**OUTPUT** ${suggestion.preview}`)
    }

    if(suggestion['hint']){
      suggestionTexts.push(`**HINT** ${suggestion['hint']}`)
    }

    return suggestionTexts.join(" ");
  }
}
