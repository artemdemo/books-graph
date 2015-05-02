
class YearsClass implements AxisDataInterface {

    years: dataObjArray;

    create(books:bookData[]) {
        this.years = {
            length: 0
        };

        for (var i=0, len=books.length; i<len; i++) {
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

    getMainObject():dataObjArray { return this.years; }

    getDataIndex( year:any ):number { return this.years[year]; }

    getDataLength():number { return this.years.length; }
}

var Years = new YearsClass();