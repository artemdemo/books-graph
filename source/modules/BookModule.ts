interface bookData {
    author: string;
    id: string;
    name: string;
    price: number;
    score: Object;
    avgScore?: number;
    voters?: number;
    year: number;
}

interface booksObject {
    Books: bookData[];
    description: string;
    name: string;
}

module Book {
    var maxRadius:number = 35;
    var relativeMaxRadius:number = 1;

    /**
     * Get all books data and calculate max radius (total number of votes) based on it's data.
     * @param books
     */
    export function calculateRelativeMaxRadius( books: bookData[] ) {
        for ( var i=0, len=books.length; i<len; i++ ) {
            var book = books[i];
            var radius = 0;
            for ( var key in book.score ) {
                radius += book.score[key]
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
                    radius += book.score[key]
                }
        return radius / relativeMaxRadius * maxRadius;
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
            score += parseInt(key) * book.score[key];
            voters += book.score[key];
        }

        if ( voters > 0 ) score = score / voters;
        return score;
    }

    /**
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     * @param books
     * @returns {bookData[]}
     */
    export function addSpecialData( books: bookData[] ) {
        for (var i=0, len=books.length; i<len; i++) {
            var voters = 0;
            books[i].avgScore = getAvgScore( books[i] );
            for ( var key in books[i].score ) {
                voters += books[i].score[key]
            }
            books[i].voters = voters;
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

        className = 'score-' + String( avgScore_floor );
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
                x: Paper.getPaperSize().width / 2,
                y: Paper.getPaperSize().height / 2
            };

            var a: Controllers.contValues;

            Controllers.getCurrentContValue();

            d.x += ( center.x - d.x ) * 0.1 * alpha;
            d.y += ( center.y - d.y ) * 0.1 * alpha;
        }
    }

    /**
     * Determine density of the circle
     * @param d
     * @returns {number}
     */
    export function getCharge(d) {
        return d.voters * -0.9;
    }
}