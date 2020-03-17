export declare class BoundElement {
    element: any;
    window: any;
    document: any;
    isContenteditable: boolean;
    isCodeMirror: boolean;
    constructor(element: any, window: any, document: any);
    setFocus(): void;
    caretPositionWithDocumentInfo(): object;
    setCaretPosition(position: any, textNode: any): void;
    getCaretPosition(): {
        top: any;
        left: any;
    };
    insertTextAtCaret(text: any): any;
    private insertTextForContenteditable;
    private insertTextForInput;
    caretPositionWithDocumentInfoForInput(): object;
    caretPositionWithDocumentInfoForContenteditable(): object;
    caretPositionWithDocumentInfoForCodeMirror(): object;
    private captureRangeText;
    private getTextAreaOrInputUnderlinePosition;
    private getContentEditableCaretPosition;
}
