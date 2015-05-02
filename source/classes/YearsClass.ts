
class YearsClass implements AxisDataInterface {

    years: dataObjArray;

    /**
     * Creating years data
     * @param books
     */
    create(books:bookData[]) {
        this.years = {
            length: 0
        };

        for (var i=0, len=books.length; i<len; i++) {
            if ( ! books[i].year ) continue;
            // Save year data in special object
            if ( this.years.hasOwnProperty( String(books[i].year) ) ) {
                this.years[books[i].year].voters++;
            } else {
                this.years[books[i].year] = {
                    voters: 0,
                    index: 0
                };
                this.years.length++;
            }
        }

        // Now I need to add index to each year.
        // It will solve problem related to the fact that I have no idea how many years there is and what is index each of them
        // Index I need to determine position of each year
        var yearsIndex = 0;
        for ( var key in this.years ) {
            if (this.years.hasOwnProperty(key)) {
                if ( this.years[key].hasOwnProperty('index') ) {
                    this.years[key].index = yearsIndex;
                    yearsIndex++;
                }
            }
        }

    }

    /**
     * Return years object
     * @returns {*}
     */
    getMainObject():dataObjArray { return this.years; }

    /**
     * Return index of given year in array of Years.
     * Will return undefined if there is no such year
     * @param year
     * @returns {number|undefined}
     */
    getDataIndex( year:number ):number { return this.years[year].index; }

    /**
     * Return length of years array
     * @returns {number}
     */
    getDataLength():number { return this.years.length; }
}

var Years = new YearsClass();