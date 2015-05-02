
class AvgScoresClass implements AxisDataInterface {

    private avgScores: dataObjArray;

    private scoreParts: number = 4;

    // Min and max scores will help to separate nodes by score.
    // I need it, case I can't assume that it will be from 1 to 5 [sad face]
    private minAvgScore:number = null;
    private maxAvgScore:number = null;

    private partValue:number = null;

    /**
     * Creating scores data
     * @param books
     */
    create( books:bookData[] ) {

        this.avgScores = {
            length: 0
        };

        for (var i=0, len=books.length; i<len; i++) {
            // Save minimum and maximum average score of all books
            if ( this.minAvgScore == null ) this.minAvgScore = books[i].avgScore;
            else if ( books[i].avgScore < this.minAvgScore ) this.minAvgScore = books[i].avgScore;
            if ( this.maxAvgScore == null ) this.maxAvgScore = books[i].avgScore;
            else if ( books[i].avgScore > this.maxAvgScore ) this.maxAvgScore = books[i].avgScore;
        }

        this.partValue = ( this.maxAvgScore - this.minAvgScore ) / ( this.scoreParts - 1);

        for ( var i=0, len=this.scoreParts; i<len; i++ ) {
            var score = this.roundScore( this.maxAvgScore - i * this.partValue  );
            this.avgScores[score] = {
                index: i
            };
            this.avgScores.length++;
        }
    }

    /**
     * Return scores object
     * @returns {*}
     */
    getMainObject():dataObjArray { return this.avgScores; }

    getDataIndex( score:number ):number {
        var scoreData = this.roundScore( score );
        return this.avgScores[scoreData].index;
    }

    /**
     * Return length of scores array
     * @returns {number}
     */
    getDataLength():number { return this.avgScores.length; }

    private roundScore ( score: number ):string {
        var times = Math.round( (score - this.minAvgScore) / this.partValue );
        var result = this.minAvgScore + times * this.partValue;
        return result.toFixed(2);
    }

}

var AvgScores = new AvgScoresClass();