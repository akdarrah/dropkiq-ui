import { DropkiqUI } from './DropkiqUI';
export declare class DropkiqUIFromScope {
    element: any;
    schema: object;
    context: object;
    scope: object;
    licenseKey: string;
    options: object;
    private dropkiqEngineFromScope;
    constructor(element: any, scope: object, licenseKey?: string, options?: object);
    dropkiqUI(): DropkiqUI;
}
