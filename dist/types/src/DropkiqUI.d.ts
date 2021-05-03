import { BoundElement } from './BoundElement';
declare enum ColumnType {
    Boolean = "ColumnTypes::Boolean",
    DateTime = "ColumnTypes::DateTime",
    HasMany = "ColumnTypes::HasMany",
    HasOne = "ColumnTypes::HasOne",
    Numeric = "ColumnTypes::Numeric",
    String = "ColumnTypes::String",
    Text = "ColumnTypes::Text",
    YAML = "ColumnTypes::YAML"
}
interface Suggestion {
    active?: boolean;
    foreign_table_name: string | null;
    hint?: string;
    iconImageURLForSuggestion: string;
    insertionTemplate?: string;
    name: string;
    nameWithoutPrefix: string;
    prefix?: string;
    preview?: string;
    selectRange?: Array<number>;
    template: string;
    type: ColumnType;
}
interface DropkiqOptions {
    iframe?: HTMLIFrameElement;
    onRender?: (renderedDocument: string) => void;
    showHints?: () => boolean;
    showPreviews?: () => boolean;
    suggestionFilter?: (suggestions: Suggestion[]) => void;
}
export declare class DropkiqUI {
    element: any;
    isCodeMirror: boolean;
    isAceEditor: boolean;
    boundElement: BoundElement;
    schema: object;
    context: object;
    scope: object;
    licenseKey: string;
    options: DropkiqOptions;
    showPreviews: Function;
    showHints: Function;
    suggestionFilter: Function;
    onRender: Function;
    iframe: any;
    document: any;
    window: any;
    pathSchema: [];
    private dropkiqEngine;
    private suggestionsArray;
    private result;
    private caretOffset;
    private $ul;
    private $header;
    private $div;
    private $errorDiv;
    private $errorMessage;
    private $errorHeader;
    private $poweredByDropkiq;
    private $paywall;
    private documentCallback;
    constructor(element: any, schema: object, context: object, scope: object, licenseKey?: string, options?: DropkiqOptions);
    updateScope(scope: object): void;
    registerFilter(name: string, filter: Function, template: string, selectionRange: Array<number>, hint?: string): void;
    menuIsOpen(): boolean;
    closeErrorAlert(): void;
    closeMenu(): void;
    private removeDocumentEventListeners;
    private renderSuggestions;
    private renderErrorAlert;
    private findResults;
    private insertSuggestion;
    private scrollToNext;
    private scrollToPrevious;
    private suggestionTitleText;
}
export {};
