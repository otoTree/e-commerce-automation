import type { ISearchPageData } from '../../models/index.js';
export interface SearchParseResult {
    success: boolean;
    data?: Partial<ISearchPageData>;
    error?: string;
    parse_duration_ms: number;
}
export interface ISearchPageParser {
    parse: (html: string, url: string) => Promise<SearchParseResult>;
    canParse: (url: string) => boolean;
    platform: string;
}
export declare const alibaba1688SearchParser: ISearchPageParser;
export declare const ozonSearchParser: ISearchPageParser;
export declare const searchPageParsers: ISearchPageParser[];
export declare const getSearchPageParser: (url: string) => ISearchPageParser | null;
//# sourceMappingURL=searchPageParser.d.ts.map