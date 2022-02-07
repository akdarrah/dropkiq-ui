export declare class BoundElement {
    element: any;
    window: any;
    document: any;
    isContenteditable: boolean;
    isCodeMirror: boolean;
    isAceEditor: boolean;
    isCKEditor5: boolean;
    cachedOnBlurRange: any;
    constructor(element: any, window: any, document: any);
    setFocus(): void;
    caretPositionWithDocumentInfo(): object;
    setCaretPosition(caretIndex: any, start: any, end: any, textNode: any, prefix: any): void;
    private getRowAndColumnForPosition;
    getCaretPosition(): {
        top: any;
        left: any;
    };
    insertTextAtCaret(text: any): any;
    setExpiringCachedOnBlurRange(range: any): void;
    private insertTextForContenteditable;
    private insertTextForInput;
    caretPositionWithDocumentInfoForInput(): object;
    caretPositionWithDocumentInfoForContenteditable(): object;
    caretPositionWithDocumentInfoForAceEditor(): object;
    caretPositionWithDocumentInfoForCodeMirror(): object;
    caretPositionWithDocumentInfoForCKEditor5(): object;
    private caretPositionWithDocumentInfoForValueRowAndColumn;
    private captureRangeText;
    private getTextAreaOrInputUnderlinePosition;
    private getContentEditableCaretPosition;
}
