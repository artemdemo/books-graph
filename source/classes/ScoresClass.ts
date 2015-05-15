
class ScoresClass implements AxisDataInterface {

    private ScoresObj: dataObjArray;

    private scoreParts: number = 4;

    // Min and max scores will help to separate nodes by score.
    // I need it, case I can't assume that it will be from 1 to 5 [sad face]
    private minScore:number = null;
    private maxScore:number = null;

    private partValue:number = null;

    /**
     * Creating scores data
     * @param scores
     */
    create( scores:number[] ) {
        this.ScoresObj = {
            length: 0
        };

        for (var i=0, len=scores.length; i<len; i++) {
            // Save minimum and maximum average score of all scores
            if ( this.minScore == null ) this.minScore = scores[i];
            else if ( scores[i] < this.minScore ) this.minScore = scores[i];
            if ( this.maxScore == null ) this.maxScore = scores[i];
            else if ( scores[i] > this.maxScore ) this.maxScore = scores[i];
        }

        this.partValue = ( this.maxScore - this.minScore ) / ( this.scoreParts - 1);

        for ( var i=0, len=this.scoreParts; i<len; i++ ) {
            var score = this.roundScore( this.maxScore - i * this.partValue  );
            this.ScoresObj[score] = {
                index: i
            };
            this.ScoresObj.length++;
        }
    }

    /**
     * Return scores object
     * @returns {*}
     */
    getMainObject():dataObjArray { return this.ScoresObj; }

    getDataIndex( score:number ):number {
        var scoreData = this.roundScore( score );
        return this.ScoresObj[scoreData].index;
    }

    /**
     * Return length of scores array
     * @returns {number}
     */
    getDataLength():number { return this.ScoresObj.length; }

    private roundScore ( score: number ):string {
        var times = Math.round( (score - this.minScore) / this.partValue );
        var result = this.minScore + times * this.partValue;
        return result.toFixed(2);
    }

}

var AvgScores = new ScoresClass();
var ArtScores = new ScoresClass();