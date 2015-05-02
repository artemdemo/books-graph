interface bookData {
    author: string;
    id: string;
    bookName: string;
    price: number;
    score: Object;
    avgScore?: number;
    voters?: number;
    year: number;
    x?: number;
    y?: number;
}

interface booksObject {
    Books: bookData[];
    description: string;
    name: string;
}

module Book {
    var maxRadius:number = 35;
    var relativeMaxRadius:number = 1;

    var years: any;
    var prices: any;

    /**
     * Get all books data and calculate max radius (total number of votes) based on it's data.
     * @param books
     */
    export function calculateRelativeMaxRadius( books: bookData[] ) {
        for ( var i=0, len=books.length; i<len; i++ ) {
            var book = books[i];
            var radius = 0;
            for ( var key in book.score ) {
                if (book.score.hasOwnProperty(key)) radius += book.score[key]
            }
            if ( radius > relativeMaxRadius ) relativeMaxRadius = radius;
        }
    }

    /**
     * Receive book and convert radius based on maximum and relative
     * @param book
     * @returns {number}
     */
    export function getBookRadius( book: bookData ) {
        var radius = 0;
        if ( book.hasOwnProperty('voters') ) radius = book.voters;
            else
                for ( var key in book.score ) {
                    if (book.score.hasOwnProperty(key)) radius += book.score[key]
                }
        return radius / relativeMaxRadius * maxRadius;
    }

    /**
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     *  also save data for each year
     * @param books
     * @returns {bookData[]}
     */
    export function addSpecialData( books: bookData[] ) {
        years = {
            length: 0
        };

        prices = {
            length: 0
        };

        for (var i=0, len=books.length; i<len; i++) {
            var voters = 0;

            // Add average score if it's missing
            if ( ! books[i].hasOwnProperty('avgScore') ) books[i].avgScore = getAvgScore( books[i] );

            // Calculate and add number of voters
            for ( var key in books[i].score ) {
                if ( books[i].score.hasOwnProperty(key) ) voters += books[i].score[key]
            }
            books[i].voters = voters;

            // Save year data in special object
            if ( years.hasOwnProperty( String(books[i].year) ) ) {
                years[books[i].year].voters++;
            } else {
                years[books[i].year] = {
                    voters: 0,
                    index: 0
                };
                years.length++;
            }
            // Same fo price data
            books[i].price = ! books[i].price ? 0 : books[i].price; // If there is 'null' I will convert it to 0
            if ( prices.hasOwnProperty( String( getRoundedPrice(books[i].price) ) ) ) {
                prices[getRoundedPrice(books[i].price)].members++;
            } else {
                prices[getRoundedPrice(books[i].price)] = {
                    members: 1, // how many books are in this price segment
                    index: 0
                };
                prices.length++;
            }
        }
        // Now I need to add index to each year.
        // It will solve problem related to the fact that I have no idea how many years there is and what is index each of them
        // Index I need to determine position of each year
        var yearsIndex = 0;
        for ( var key in years ) {
            if (years.hasOwnProperty(key)) {
                if ( years[key].hasOwnProperty('index') ) {
                    years[key].index = yearsIndex;
                    yearsIndex++;
                }
            }
        }
        // Same thing for the price list
        var priceIndex = 0;
        for ( var key in prices ) {
            if (prices.hasOwnProperty(key)) {
                if ( prices[key].hasOwnProperty('index') ) {
                    prices[key].index = priceIndex;
                    priceIndex++;
                }
            }
        }
        return books;
    }

    /**
     * Generate class for each circle in graph
     * @param book
     * @returns {string}
     */
    export function getCircleClass ( book: bookData ) {
        var avgScore:number = book.hasOwnProperty('avgScore') ? book.avgScore : getAvgScore(book);
        var avgScore_floor = Math.floor( avgScore );
        var avgScore_group = Math.floor( (avgScore - avgScore_floor) * 10 );
        var className:string;

        className = 'book-node score-' + String( avgScore_floor );
        className += ' group-' + String( avgScore_group );

        return className
    }

    /**
     * Organise all dots in one center
     * @param alpha
     * @returns {*}
     */
    export function moveTowardCenter( alpha ) {
        return function(d) {
            var center = {
                x: getXcenter( d ),
                y: getYcenter( d )
            };

            d.x += ( center.x - d.x ) * 0.1 * alpha;
            d.y += ( center.y - d.y ) * 0.1 * alpha;
        }
    }

    /**
     * Determine density of the circle
     * @param book
     * @returns {number}
     */
    export function getCharge( book: bookData ) {
        return book.voters * -0.9;
    }

    /**
     * On mouse enter book circle
     * @param book
     */
    export function onMouseEnter( book:bookData ) {

        Tooltip.constructTooltip( book );
    }

    /**
     * On mouse leave book circle
     * @param book
     */
    export function onMouseLeave( book:bookData ) {

        Tooltip.dismantleTooltip();
    }

    /**
     * Return years object
     * @returns {*}
     */
    export function getYearsObject() { return years; }

    /**
     * Return prices object
     * @returns {*}
     */
    export function getPricesObject() { return prices; }

    /**
     * Calculate avg score of given book
     * @param book
     * @returns {number}
     */
    function getAvgScore ( book: bookData ) {
        var score:number = 0;
        var voters:number = 0;

        for ( var key in book.score ) {
            if ( book.score.hasOwnProperty( key ) ) {
                score += parseInt(key) * book.score[key];
                voters += book.score[key];
            }
        }

        if ( voters > 0 ) score = score / voters;
        return score;
    }

    /**
     * Round whole number
     * 25.6 -> 30
     * 124.3 -> 120
     * @param price
     * @returns {number}
     */
    function getRoundedPrice( price: number ):number {
        var priceStr:string = String( Math.round( price ) );
        var lastNum:number = parseInt( priceStr.slice(-1) );
        var result: number;

        if ( lastNum > 4 ) result = parseInt( priceStr ) + ( 10 - lastNum );
            else result = parseInt( priceStr ) - lastNum;

        return result;
    }

    /**
     * Calculate Y of the center
     * @param book
     * @returns {number}
     */
    function getYcenter ( book: bookData ) {
        var y = Paper.getPaperSize().height / 2;

        if ( Controllers.getCurrentContValue().y == Controllers.contValues.score ) {
            if ( Math.floor( book.avgScore ) == 1 ) {
                y = ( Paper.getPaperSize().height / 10 ) * 9
            } else {
                var id = 5 - Math.floor( book.avgScore );
                y = ( Paper.getPaperSize().height / 10 ) * ( 2 * id + 1 )
            }
        }
        return y;
    }

    /**
     * Calculate X of the center
     * @param book
     * @returns {number}
     */
    function getXcenter ( book: bookData ) {
        var x;
        var xValueArr;
        var xValueData;

        if ( Controllers.getCurrentContValue().x == Controllers.contValues.year ) {
            xValueData = years[ book.year ];
            xValueArr = years;
        } else if ( Controllers.getCurrentContValue().x == Controllers.contValues.price ) {
            xValueData = prices[ getRoundedPrice(book.price) ];
            xValueArr = prices;
        }

        if ( xValueData == undefined ) {
            x = Paper.getPaperSize().width / 2;
        } else if ( xValueData.index == 0 ) {
            x = Paper.getPaperSize().width / (xValueArr.length * 2)
        } else {
            x = ( Paper.getPaperSize().width / (xValueArr.length * 2) ) * ( 2 * xValueData.index + 1 )
        }

        return x;
    }

}