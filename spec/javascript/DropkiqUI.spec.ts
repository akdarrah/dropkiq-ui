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
    expect(dropkiqUI['menuMode']).toStrictEqual(false);

    let dropkiqDiv = document.getElementById('dropkiq-autosuggest-menu');
    expect(dropkiqDiv.innerHTML.length).not.toBe(0);
  })
})
