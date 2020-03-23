import { DropkiqEngine, DropkiqEngineFromScope } from 'dropkiq';
import { DropkiqUI } from './DropkiqUI';

export class DropkiqUIFromScope {
  public element: any;
  public schema: object;
  public context: object;
  public scope: object;
  public licenseKey: string;
  public options: object;
  private dropkiqEngineFromScope: DropkiqEngineFromScope;

  constructor(element, scope: object, licenseKey: string = "", options: object = {}) {
    this.element    = element;
    this.scope      = scope;
    this.licenseKey = licenseKey;
    this.options    = options;

    this.dropkiqEngineFromScope = new DropkiqEngineFromScope(
      "",
      0,
      this.scope,
      this.licenseKey,
      this.options
    );

    this.schema  = this.dropkiqEngineFromScope.schema;
    this.context = this.dropkiqEngineFromScope.context;
  }

  public dropkiqUI(): DropkiqUI {
    return new DropkiqUI(
      this.element,
      this.schema,
      this.context,
      this.scope,
      this.licenseKey,
      this.options
    )
  }
}
