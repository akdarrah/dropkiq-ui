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
