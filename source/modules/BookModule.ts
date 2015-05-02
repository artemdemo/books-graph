
module Book {
    var maxRadius:number = 55;
    var relativeMaxRadius:number = 1;

    var scores: dataObjArray;

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
     *  get min and max scores
     * @param books
     * @returns {bookData[]}
     */
    export function addSpecialData( books: bookData[] ) {

        // Min and max scores will help to separate nodes by score.
        // I need it, case I can't assume that it will be from 1 to 5 [sad face]
        var minScore:number = null;
        var maxScore:number = null;

        for (var i=0, len=books.length; i<len; i++) {
            var voters = 0;

            // Add average score if it's missing
            if ( ! books[i].hasOwnProperty('avgScore') ) books[i].avgScore = getAvgScore( books[i] );

            // If there is 'null' I will convert it to 0
            books[i].price = ! books[i].price ? 0 : books[i].price;

            // Save minimum and maximum score of all books
            if ( minScore == null ) minScore = books[i].avgScore;
            else if ( books[i].avgScore < minScore ) minScore = books[i].avgScore;
            if ( maxScore == null ) maxScore = books[i].avgScore;
            else if ( books[i].avgScore > maxScore ) maxScore = books[i].avgScore;

            // Calculate and add number of voters
            for ( var key in books[i].score ) {
                if ( books[i].score.hasOwnProperty(key) ) voters += books[i].score[key]
            }
            books[i].voters = voters;

            // Same for score data
            //console.log( books[i].avgScore );
        }

        Prices.create( books );
        Years.create( books );
        AvgScores.create( books );

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
     * Determine density of the circles
     * @param book
     * @returns {number}
     */
    export function getCharge( book: bookData ) {
        return book.voters * -0.5;
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
     * Calculate Y of the center
     * @param book
     * @returns {number}
     */
    function getYcenter ( book: bookData ) {
        var y;
        var yValueIndex;
        var yValueLength;

        if ( Controllers.getCurrentContValue().y == Controllers.contValues.avgScore ) {
            yValueIndex = AvgScores.getDataIndex( book.avgScore );
            yValueLength = AvgScores.getDataLength();
        } else if ( Controllers.getCurrentContValue().y == Controllers.contValues.artScore ) {
            //yValueIndex = ArtScores.getDataIndex( book.artScore );
            //yValueLength = ArtScores.getDataLength();
        }

        if ( yValueIndex == undefined ) {
            y = Paper.getPaperSize().height / 2;
        } else if ( yValueIndex == 0 ) {
            y = Paper.getPaperSize().height / (yValueLength * 2)
        } else {
            y = ( Paper.getPaperSize().height / (yValueLength * 2) ) * ( 2 * yValueIndex + 1 )
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
        var xValueLength;
        var xValueIndex;

        if ( Controllers.getCurrentContValue().x == Controllers.contValues.year ) {
            xValueIndex = Years.getDataIndex( book.year );
            xValueLength = Years.getDataLength();
        } else if ( Controllers.getCurrentContValue().x == Controllers.contValues.price ) {
            xValueIndex = Prices.getDataIndex( book.price );
            xValueLength = Prices.getDataLength();
        }

        if ( xValueIndex == undefined ) {
            x = Paper.getPaperSize().width / 2;
        } else if ( xValueIndex == 0 ) {
            x = Paper.getPaperSize().width / (xValueLength * 2)
        } else {
            x = ( Paper.getPaperSize().width / (xValueLength * 2) ) * ( 2 * xValueIndex + 1 )
        }

        return x;
    }

}