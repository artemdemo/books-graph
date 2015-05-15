interface bookData {
    author: string;
    id: string;
    bookName: string;
    price: number;
    score: Object;
    avgScore: number;
    artScore: number;
    voters?: number;
    year: number;
    x?: number;
    y?: number;
}

interface dataObjArray {
    [key: string]: any;
    length: number;
}

/**
 * AxisDataInterface define interface for main classes that define data objects: prices, years, scores end etc.
 */
interface AxisDataInterface {
    create( books: any[] );
    getMainObject(): dataObjArray;
    getDataIndex( param: any ): number;
    getDataLength(): number;
}