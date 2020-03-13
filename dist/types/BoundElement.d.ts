export declare class BoundElement {
    element: any;
    isContenteditable: boolean;
    constructor(element: any);
    caretPositionWithDocumentInfo(): object;
    setCaretPosition(position: any, textNode: any): void;
    getCaretPosition(): {
        left: number;
        top: any;
    };
    insertTextAtCaret(text: any): any;
    private insertTextForContenteditable;
    private insertTextForInput;
    caretPositionWithDocumentInfoForInput(): object;
    caretPositionWithDocumentInfoForContenteditable(): object;
    private captureRangeText;
    private getTextAreaOrInputUnderlinePosition;
    private getContentEditableCaretPosition;
}
