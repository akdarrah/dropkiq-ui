import { DropkiqUIFromScope } from '../../src/DropkiqUIFromScope';

describe('DropkiqUIFromScope#constructor', () => {
  it('can be initialized', () => {
	  let element = document.getElementById('dropkiq-example');
    let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let scope = {name: "Adam"}
    let dropkiqUIFromScope = new DropkiqUIFromScope(element, scope, licenseKey);

    expect(dropkiqUIFromScope.element).toBe(element);
    expect(dropkiqUIFromScope.scope).toBe(scope);
    expect(dropkiqUIFromScope.licenseKey).toBe(licenseKey);
    expect(dropkiqUIFromScope.schema).toStrictEqual({});
    
    expect(dropkiqUIFromScope.context).toStrictEqual({
      name: {
        type: "ColumnTypes::String",
        foreign_table_name: null
      }
    });
  })
})

describe('DropkiqUIFromScope#dropkiqUI', () => {
  it('created a DropkiqUI instance', () => {
	  let element = document.getElementById('dropkiq-example');
    let licenseKey = "0a782a70-20fb-0138-f7b1-2cde48001122"
    let scope = {name: "Adam"}

    let dropkiqUIFromScope = new DropkiqUIFromScope(element, scope, licenseKey);
    let dropkiqUI = dropkiqUIFromScope.dropkiqUI();

    expect(dropkiqUI.element).toBe(element);
    expect(dropkiqUI.schema).toStrictEqual(dropkiqUIFromScope.schema);
    expect(dropkiqUI.context).toStrictEqual(dropkiqUIFromScope.context);
    expect(dropkiqUI.scope).toStrictEqual(dropkiqUIFromScope.scope);
    expect(dropkiqUI.licenseKey).toStrictEqual(licenseKey);
  })
})
