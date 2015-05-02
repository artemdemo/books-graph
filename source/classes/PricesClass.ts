
class PricesClass implements AxisDataInterface {

    prices: dataObjArray;

    /**
     * Creating prices data
     * @param books
     */
    create( books: bookData[] ) {
        this.prices = {
            length: 0
        };

        for (var i=0, len=books.length; i<len; i++) {
            if ( this.prices.hasOwnProperty( String( PricesClass.getRoundedPrice(books[i].price) ) ) ) {
                this.prices[ PricesClass.getRoundedPrice(books[i].price)].members++;
            } else {
                this.prices[ PricesClass.getRoundedPrice(books[i].price)] = {
                    members: 1, // how many books are in this price segment
                    index: 0
                };
                this.prices.length++;
            }
        }

        // Now I need to add index to each price.
        // It will solve problem related to the fact that I have no idea how many prices there is and what is index each of them
        // Index I need to determine position of each price on axis
        var priceIndex = 0;
        for ( var key in this.prices ) {
            if (this.prices.hasOwnProperty(key)) {
                if ( this.prices[key].hasOwnProperty('index') ) {
                    this.prices[key].index = priceIndex;
                    priceIndex++;
                }
            }
        }

    }

    /**
     * Return prices object
     * @returns {*}
     */
    getMainObject() { return this.prices; }

    /**
     * Return index of given price in array of Prices.
     * Will return undefined if there is no such price
     * @param bookPrice
     * @returns {number|undefined}
     */
    getDataIndex( bookPrice: number ) {
        var priceData = this.prices[ PricesClass.getRoundedPrice( bookPrice ) ];
        return !! priceData ? priceData.index : undefined;
    }

    /**
     * Return length of prices array
     * @returns {number}
     */
    getDataLength() { return this.prices.length }

    /**
     * Round whole number
     * 25.6 -> 30
     * 124.3 -> 120
     * @param price
     * @private
     * @static
     * @returns {number}
     */
    private static getRoundedPrice( price: number ):number {
        var priceStr:string = String( Math.round( price ) );
        var lastNum:number = parseInt( priceStr.slice(-1) );
        var result: number;

        if ( lastNum > 4 ) result = parseInt( priceStr ) + ( 10 - lastNum );
        else result = parseInt( priceStr ) - lastNum;

        return result;
    }

}

var Prices = new PricesClass();