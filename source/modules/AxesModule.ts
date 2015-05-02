
module Axes {

    var $artScoreAxis: HTMLDivElement;
    var $avgScoreAxis: HTMLDivElement;
    var $yearAxis: HTMLDivElement;
    var $priceAxis: HTMLDivElement;

    var showAxisClass = 'visible';

    /**
     * Adding axis to the graph
     */
    export function addAxes() {
        createAvgScoreAxis();
        createArtScoreAxis();
        createYearsAxis();
        createPriceAxis();
    }

    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    export function showAxis ( axis: Controllers.contValues ) {
        var $axis: HTMLDivElement = getAxisNode( axis );

        if ( ! new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className) ) {
            $axis.className += ' ' + showAxisClass;
        }
    }

    /**
     * Hide axis - will choose axis by given parameter
     * @param axis
     */
    export function hideAxis ( axis: Controllers.contValues ) {
        var $axis: HTMLDivElement = getAxisNode( axis );

        if ( new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        }
    }

    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    export function toggleAxis ( axis: Controllers.contValues ) {
        var $axis: HTMLDivElement = getAxisNode( axis );

        if ( new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        } else {
            $axis.className += ' ' + showAxisClass;
        }
    }

    function getAxisNode( axis: Controllers.contValues ): HTMLDivElement {
        var $axis: HTMLDivElement;

        switch( true ) {
            case axis == Controllers.contValues.year:
                $axis = $yearAxis;
                break;
            case axis == Controllers.contValues.avgScore:
                $axis = $avgScoreAxis;
                break;
            case axis == Controllers.contValues.artScore:
                $axis = $artScoreAxis;
                break;
            case axis == Controllers.contValues.price:
                $axis = $priceAxis;
                break;
        }

        return $axis;
    }


    /**
     * Creating Art Score axis - Y
     */
    function createArtScoreAxis() {
        $artScoreAxis = document.createElement('div');
        $artScoreAxis.setAttribute('id', 'artScoreAxis-group');
        $artScoreAxis.setAttribute('class', 'axis-group y-axis');
        $artScoreAxis.style.top = ( Paper.getPaperSize().height / 10 ) * 2 + 'px';

        document.body.appendChild( $artScoreAxis );

        for ( var i=4; i>0; i-- ) {
            var $text: HTMLDivElement = document.createElement('div');

            $text.setAttribute('class', 'node score');
            $text.appendChild( document.createTextNode( String(i) ) );
            if ( i != 4 ) $text.style.marginTop = ( Paper.getPaperSize().height / 10 ) * 2.2 + 'px';

            $artScoreAxis.appendChild( $text );
        }
    }

    /**
     * Creating Average Score axis - Y
     */
    function createAvgScoreAxis() {
        var avgScores = AvgScores.getMainObject();

        $avgScoreAxis = document.createElement('div');
        $avgScoreAxis.setAttribute('id', 'avgScoreAxis-group');
        $avgScoreAxis.setAttribute('class', 'axis-group y-axis');
        $avgScoreAxis.style.top = ( Paper.getPaperSize().height / 10 ) * 2 + 'px';

        document.body.appendChild( $avgScoreAxis );

        for ( var key in avgScores ) {
            if ( avgScores.hasOwnProperty(key) && parseInt(key) == parseInt(key) ) {
                var $text: HTMLDivElement = document.createElement('div');

                $text.setAttribute('class', 'node score');
                $text.appendChild( document.createTextNode( key ) );

                $avgScoreAxis.appendChild( $text );
            }
        }

    }

    /**
     * Creating Years axis - X
     */
    function createYearsAxis() {
        var years = Years.getMainObject();

        $yearAxis = document.createElement('div');
        $yearAxis.setAttribute('id', 'yearAxis-group');
        $yearAxis.setAttribute('class', 'axis-group x-axis');

        document.body.appendChild( $yearAxis );

        for ( var key in years ) {
            if ( years.hasOwnProperty(key) && parseInt(key) == parseInt(key) ) {
                var $text: HTMLSpanElement = document.createElement('span');

                $text.setAttribute('class', 'node year');
                $text.appendChild( document.createTextNode( key ) );

                $yearAxis.appendChild( $text );
            }
        }
    }

    /**
     * Creating Price axis - X
     */
    function createPriceAxis() {
        var prices = Prices.getMainObject();

        $priceAxis = document.createElement('div');
        $priceAxis.setAttribute('id', 'priceAxis-group');
        $priceAxis.setAttribute('class', 'axis-group x-axis');

        document.body.appendChild( $priceAxis );

        for ( var key in prices ) {
            if ( prices.hasOwnProperty(key) && parseInt(key) == parseInt(key) ) {
                var $text: HTMLSpanElement = document.createElement('span');

                $text.setAttribute('class', 'node price');
                $text.appendChild( document.createTextNode( key ) );

                $priceAxis.appendChild( $text );
            }
        }
    }

}