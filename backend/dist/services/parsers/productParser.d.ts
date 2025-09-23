import type { IProductFullData } from '../../models/index.js';
export interface ParseResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    parse_duration_ms: number;
}
export interface IProductParser {
    parse: (html: string, url: string) => Promise<ParseResult<Partial<IProductFullData>>>;
    canParse: (url: string) => boolean;
    platform: string;
}
export declare const alibaba1688ProductParser: IProductParser;
export declare const ozonProductParser: IProductParser;
export declare const productParsers: IProductParser[];
export declare const getProductParser: (url: string, html?: string) => IProductParser | null;
export declare const identifyPlatform: (url: string, html?: string) => string;
//# sourceMappingURL=productParser.d.ts.map