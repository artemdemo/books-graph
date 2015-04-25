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

    var years: any;

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
        for (var i=0, len=books.length; i<len; i++) {
            var voters = 0;
            books[i].avgScore = getAvgScore( books[i] );
            for ( var key in books[i].score ) {
                voters += books[i].score[key]
            }
            books[i].voters = voters;
            if ( years.hasOwnProperty( String(books[i].year) ) ) {
                years[books[i].year].voters++;
            } else {
                years[books[i].year] = {
                    voters: 0,
                    index: 0
                };
                years.length++;
            }
        }
        // Now I need to add index to each year.
        // It will solve problem related to the fact tha I have no idea how many years there is and what is index each of them
        // Index I need to determine position of each year
        var yearsIndex = 0;
        for ( var key in years ) {
            if ( years[key].hasOwnProperty('index') ) {
                years[key].index = yearsIndex;
                yearsIndex++;
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

            if ( Controllers.getCurrentContValue() == Controllers.contValues.score ) {
                center = getScoreCenter( d );
            } else if ( Controllers.getCurrentContValue() == Controllers.contValues.year ) {
                center = getYearCenter( d )
            }

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
     * Calculate center position if filtered by score
     * @param book
     * @returns {{x: number, y: number}}
     */
    function getScoreCenter ( book: bookData ) {
        var center = {
            x: Paper.getPaperSize().width / 2,
            y: Paper.getPaperSize().height / 2
        };

        if ( Math.floor( book.avgScore ) == 1 ) {
            center.y = ( Paper.getPaperSize().height / 10 ) * 9
        } else {
            var id = 5 - Math.floor( book.avgScore );
            center.y = ( Paper.getPaperSize().height / 10 ) * ( 2 * id + 1 )
        }
        return center;
    }

    /**
     * Calculate center position if filtered by score and year
     * @param book
     * @returns {{x: number, y: number}}
     */
    function getYearCenter ( book: bookData ) {
        var yearData = years[ book.year ];
        var center = {
            x: Paper.getPaperSize().width / 2,
            y: Paper.getPaperSize().height / 2
        };

        if ( Math.floor( book.avgScore ) == 1 ) {
            center.y = ( Paper.getPaperSize().height / 10 ) * 9
        } else {
            var id = 5 - Math.floor( book.avgScore );
            center.y = ( Paper.getPaperSize().height / 10 ) * ( 2 * id + 1 )
        }

        if ( yearData.index == 0 ) {
            center.x = Paper.getPaperSize().width / (years.length * 2)
        } else {
            center.x = ( Paper.getPaperSize().width / (years.length * 2) ) * ( 2 * yearData.index + 1 )
        }

        return center;
    }
}