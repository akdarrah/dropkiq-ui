import { DropkiqUI } from '../../src/DropkiqUI';

const testSchema = {
	"custom_field_values": {
		"methods": {
			"value": {
				"type": "ColumnTypes::Text",
				"foreign_table_name": null
			}
		}
	},
	"events": {
		"methods": {
			"ends_at": {
				"type": "ColumnTypes::DateTime",
				"foreign_table_name": null
			},
			"name": {
				"type": "ColumnTypes::String",
				"foreign_table_name": null
			},
			"number_of_days_until_order_deadline": {
				"type": "ColumnTypes::Numeric",
				"foreign_table_name": null
			},
			"partnership_count": {
				"type": "ColumnTypes::Numeric",
				"foreign_table_name": null
			},
			"partnerships": {
				"type": "ColumnTypes::HasMany",
				"foreign_table_name": "partnerships"
			},
			"starts_at": {
				"type": "ColumnTypes::DateTime",
				"foreign_table_name": null
			}
		}
	},
	"organization_partnerships": {
		"methods": {
			"name": {
				"type": "ColumnTypes::String",
				"foreign_table_name": null
			},
			"public_event_organization_partnership_url": {
				"type": "ColumnTypes::String",
				"foreign_table_name": null
			}
		}
	},
	"partnerships": {
		"methods": {
			"email": {
				"type": "ColumnTypes::String",
				"foreign_table_name": null
			},
			"name": {
				"type": "ColumnTypes::String",
				"foreign_table_name": null
			},
			"organization_partnership": {
				"type": "ColumnTypes::HasOne",
				"foreign_table_name": "organization_partnerships"
			},
			"task_completions": {
				"type": "ColumnTypes::HasMany",
				"foreign_table_name": "task_completions"
			}
		}
	},
	"task_completions": {
		"methods": {
			"custom_field_values": {
				"type": "ColumnTypes::HasMany",
				"foreign_table_name": "custom_field_values"
			}
		}
	}
}

const context = {
  "event": {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "events"
  }
}

afterEach(() => {
  delete window['dropkiqUIInstances'];

  let textareaElement = document.getElementById('dropkiq-example');
  let inputElement = document.getElementById('dropkiq-input-example');
  let contenteditable = document.getElementById('dropkiq-contenteditable-example');

  textareaElement.removeAttribute('data-dropkiq-fingerprint');
  inputElement.removeAttribute('data-dropkiq-fingerprint');
  contenteditable.removeAttribute('data-dropkiq-fingerprint');
});

describe('DropkiqUI#constructor', () => {
  it('can be initialized', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    expect(dropkiqUI['element']).toStrictEqual(element)
    expect(dropkiqUI['schema']).toStrictEqual(testSchema)
    expect(dropkiqUI['context']).toStrictEqual(context)
    expect(dropkiqUI['scope']).toStrictEqual({})
    expect(dropkiqUI['licenseKey']).toStrictEqual(licenseKey)

    expect(dropkiqUI['suggestionsArray']).toStrictEqual([]);
    expect(dropkiqUI['result']).toStrictEqual({});
    expect(dropkiqUI['caretOffset']).toStrictEqual({});
    expect(dropkiqUI['pathSchema']).toStrictEqual([]);

    let dropkiqDiv = document.getElementById('dropkiq-autosuggest-menu');
    expect(dropkiqDiv.innerHTML.length).not.toBe(0);
  })

  it('can be initialized multiple times on the same text element', () => {
    let licenseKey = "3f8f9a00-666e-0138-fa67-721898367c56";
	  let element = document.getElementById('dropkiq-example');
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let dropkiqUITwo = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUITwo.licenseKey).toBe(licenseKey);

    let dropkiqUIThree = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUIThree.licenseKey).toBe(licenseKey);
  })

  it('can be initialized multiple times on the same input', () => {
    let licenseKey = "4864a550-666e-0138-fa67-721898367c56";
	  let element = document.getElementById('dropkiq-input-example');
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let dropkiqUITwo = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUITwo.licenseKey).toBe(licenseKey);

    let dropkiqUIThree = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUIThree.licenseKey).toBe(licenseKey);
  })

  it('can be initialized multiple times on the same contenteditable', () => {
    let licenseKey = "4fdca4e0-666e-0138-fa67-721898367c56";
	  let element = document.getElementById('dropkiq-contenteditable-example');
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let dropkiqUITwo = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUITwo.licenseKey).toBe(licenseKey);

    let dropkiqUIThree = new DropkiqUI(element, testSchema, context, {}, "");
    expect(dropkiqUIThree.licenseKey).toBe(licenseKey);
  })

  it('multiple instances can be active at the same time', () => {
    let textLicenseKey = "56478560-666e-0138-fa67-721898367c56";
	  let textElement = document.getElementById('dropkiq-contenteditable-example');
    let textDropkiqUI = new DropkiqUI(textElement, testSchema, context, {}, textLicenseKey);

    let textDropkiqUITwo = new DropkiqUI(textElement, testSchema, context, {}, "");
    expect(textDropkiqUITwo.licenseKey).toBe(textLicenseKey);

    let inputLicenseKey = "5af85c90-666e-0138-fa67-721898367c56";
	  let inputElement = document.getElementById('dropkiq-input-example');
    let inputDropkiqUI = new DropkiqUI(inputElement, testSchema, context, {}, inputLicenseKey);

    let inputDropkiqUITwo = new DropkiqUI(inputElement, testSchema, context, {}, "");
    expect(inputDropkiqUITwo.licenseKey).toBe(inputLicenseKey);
  })

  it('multiple instances can be active at the same time (for same element type)', () => {
    let textLicenseKey = "56478560-666e-0138-fa67-721898367c56";
	  let textElement = document.getElementById('dropkiq-example');
    let textDropkiqUI = new DropkiqUI(textElement, testSchema, context, {}, textLicenseKey);
    expect(textDropkiqUI.licenseKey).toBe(textLicenseKey);

    let text2LicenseKey = "5af85c90-666e-0138-fa67-721898367c56";
	  let text2Element = document.getElementById('dropkiq-example-2');
    let text2DropkiqUI = new DropkiqUI(text2Element, testSchema, context, {}, text2LicenseKey);
    expect(text2DropkiqUI.licenseKey).toBe(text2LicenseKey);
  })
})

describe('DropkiqUI#findResults', () => {
  it('populates results for a valid Liquid expression', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ ",
        selectionStart: 3,
        rightText: " }}",
        allText: ("{{  }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    expect(dropkiqUI['result']).toStrictEqual({});
    dropkiqUI['findResults']()
    expect(dropkiqUI['result']['suggestionsArray'].length).toBe(1);
  })

  it('silences ParseErrors from unfinished Liquid expressions', () => {
	  let element = document.getElementById('dropkiq-example');
    let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{% f",
        selectionStart: 4,
        rightText: " %}",
        allText: ("{% f %}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    expect(dropkiqUI['result']).toStrictEqual({});
    expect(function() {
      dropkiqUI['findResults']()
    }).not.toThrow();
    expect(dropkiqUI['result']).toStrictEqual({});
  })

  it('renders the error div menu for Liquid Render Errors', () => {
	  let element = document.getElementById('dropkiq-example');
    let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ .",
        selectionStart: 4,
        rightText: " }}",
        allText: ("{{ . }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    expect(dropkiqUI['result']).toStrictEqual({});
    expect(dropkiqUI['$errorDiv'].style["display"]).toBe(""); // display none set in CSS

    expect(function() {
      dropkiqUI['findResults']()
    }).not.toThrow();

    expect(dropkiqUI['result']).toStrictEqual({});
    expect(dropkiqUI['$errorDiv'].style["display"]).toBe("block");
  })

  it('closes the menu if an exception happens in dropkiqEngine.update', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event.",
        selectionStart: 9,
        rightText: " }}",
        allText: ("{{ event. }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    dropkiqUI['findResults']();
    expect(dropkiqUI['suggestionsArray'].length).toBe(1); // Non-Pro

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event..",
        selectionStart: 10,
        rightText: " }}",
        allText: ("{{ event.. }}")
      }
    }

    try {
      dropkiqUI['findResults']();
    } catch (e) {
      expect(dropkiqUI['suggestionsArray'].length).toBe(0);
    }
  })

  it('swallows exceptions when you are accessing an array index with the left brace typed [', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event.partnerships[",
        selectionStart: 22,
        rightText: " }}",
        allText: ("{{ event.partnerships[ }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    dropkiqUI['findResults']();
    expect(dropkiqUI['suggestionsArray'].length).toBe(0);
  })

  it('swallows exceptions when you are accessing an array index with the left brace and index typed [0', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event.partnerships[0",
        selectionStart: 23,
        rightText: " }}",
        allText: ("{{ event.partnerships[0 }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    dropkiqUI['findResults']();
    expect(dropkiqUI['suggestionsArray'].length).toBe(0);
  })

  it('evaluates accessing an array index as an object for typed [0]', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event.partnerships[0]",
        selectionStart: 24,
        rightText: " }}",
        allText: ("{{ event.partnerships[0] }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    dropkiqUI['findResults']();
    expect(dropkiqUI['suggestionsArray'].length).toBe(0);
  })

  it('returns suggestions for accessing an array index [0].', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ event.partnerships[0].",
        selectionStart: 25,
        rightText: " }}",
        allText: ("{{ event.partnerships[0]. }}")
      }
    }

    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    dropkiqUI['findResults']();
    expect(dropkiqUI['suggestionsArray'].length).toBe(1);
  })
})

describe('DropkiqUI#scrollToNext', () => {
  it('can go to the next suggestion', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    dropkiqUI['renderSuggestions'] = function(){};

    dropkiqUI['suggestionsArray'] = [
      {name: "Test One", active: true},
      {name: "Test Two"}
    ]

    dropkiqUI['scrollToNext']();

    expect(dropkiqUI['suggestionsArray'][0]['active']).toBe(false)
    expect(dropkiqUI['suggestionsArray'][1]['active']).toBe(true)
  })

  it('wraps back to the first suggestion', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    dropkiqUI['renderSuggestions'] = function(){};

    dropkiqUI['suggestionsArray'] = [
      {name: "Test One", active: false},
      {name: "Test Two", active: true}
    ]

    dropkiqUI['scrollToNext']();

    expect(dropkiqUI['suggestionsArray'][0]['active']).toBe(true)
    expect(dropkiqUI['suggestionsArray'][1]['active']).toBe(false)
  })
})

describe('DropkiqUI#scrollToPrevious', () => {
  it('can go to the previous suggestion', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    dropkiqUI['renderSuggestions'] = function(){};

    dropkiqUI['suggestionsArray'] = [
      {name: "Test One", active: false},
      {name: "Test Two", active: true}
    ]

    dropkiqUI['scrollToPrevious']();

    expect(dropkiqUI['suggestionsArray'][0]['active']).toBe(true)
    expect(dropkiqUI['suggestionsArray'][1]['active']).toBe(false)
  })

  it('can wrap to the last suggestion', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    dropkiqUI['renderSuggestions'] = function(){};

    dropkiqUI['suggestionsArray'] = [
      {name: "Test One", active: true},
      {name: "Test Two", active: false}
    ]

    dropkiqUI['scrollToPrevious']();

    expect(dropkiqUI['suggestionsArray'][0]['active']).toBe(false)
    expect(dropkiqUI['suggestionsArray'][1]['active']).toBe(true)
  })
})

describe('DropkiqUI#closeMenu', () => {
  it('clears the list of suggestions to close the menu', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    dropkiqUI['renderSuggestions'] = function(){};

    dropkiqUI['suggestionsArray'] = [
      {name: "Test One", active: false},
      {name: "Test Two", active: true}
    ]

    dropkiqUI['closeMenu']();
    expect(dropkiqUI['suggestionsArray']).toStrictEqual([])
  })
})

describe('DropkiqUI#suggestionTitleText', () => {
  it('constructs title text with only the name', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let suggestion = {name: "Test"}
    let titleText  = dropkiqUI['suggestionTitleText'](suggestion);

    expect(titleText).toStrictEqual("Test")
  })

  it('constructs title text with a preview', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let suggestion = {name: "Test", preview: "Preview"}
    let titleText  = dropkiqUI['suggestionTitleText'](suggestion);

    expect(titleText).toStrictEqual("Test **OUTPUT** Preview")
  })

  it('constructs title text with a hint', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let suggestion = {name: "Test", hint: "Hint"}
    let titleText  = dropkiqUI['suggestionTitleText'](suggestion);

    expect(titleText).toStrictEqual("Test **HINT** Hint")
  })

  it('constructs title text with a preview and hint', () => {
    let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);

    let suggestion = {name: "Test", preview: "Preview", hint: "Hint"}
    let titleText  = dropkiqUI['suggestionTitleText'](suggestion);

    expect(titleText).toStrictEqual("Test **OUTPUT** Preview **HINT** Hint")
  })
})

describe('DropkiqUI#registerFilter', () => {
  it('A custom filter can be registered', () => {
	  let element = document.getElementById('dropkiq-example');
	  let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let dropkiqUI = new DropkiqUI(element, testSchema, context, {}, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    expect(Object.keys(dropkiqUI['dropkiqEngine']['dataSchema']['filterRegistry']['registry']).length).toBe(45);

    dropkiqUI.registerFilter('fire', function(str: string, count: number){
      return `${str} ${'🔥'.repeat(count)}`;
    }, "fire: 3", [6,7], "add n 🔥-emojis to the end of your string");

    expect(Object.keys(dropkiqUI['dropkiqEngine']['dataSchema']['filterRegistry']['registry']).length).toBe(46);
  })
})

describe('DropkiqUI#updateScope', () => {
  it('Scope can be updated', () => {
	  let element = document.getElementById('dropkiq-example');
    let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let context = {
      "test": {
        type: "ColumnTypes::String",
        foreign_table_name: null
      }
    }
    let scope = {
      test: "firstScope"
    }
    let dropkiqUI = new DropkiqUI(element, testSchema, context, scope, licenseKey);
    let boundElement = dropkiqUI['boundElement'];

    boundElement.caretPositionWithDocumentInfo = function(){
      return {
        leftText: "{{ ",
        selectionStart: 3,
        rightText: " }}",
        allText: ("{{  }}")
      }
    }
    boundElement.getCaretPosition = function(){
      return {
        top: 1000,
        left: 4000,
      }
    }

    expect(dropkiqUI['result']).toStrictEqual({});
    dropkiqUI['findResults']();
    expect(dropkiqUI['result']['suggestionsArray'].length).toBe(1);
    expect(dropkiqUI['result']['suggestionsArray'][0]['preview']).toBe("firstScope");

    let newScope = {
      test: "newScope"
    }
    dropkiqUI.updateScope(newScope);
    dropkiqUI['findResults']();
    expect(dropkiqUI['result']['suggestionsArray'].length).toBe(1);
    expect(dropkiqUI['result']['suggestionsArray'][0]['preview']).toBe("newScope");
  })
})
