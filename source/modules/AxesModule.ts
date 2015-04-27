module Axes {

    var $yearAxis: HTMLDivElement;
    var $scoreAxis: HTMLDivElement;

    var showAxisClass = 'show';

    export enum Axis { year, score }

    /**
     * Adding axis to the graph
     */
    export function addAxes() {
        createXaxis();
        createScoreAxis();
    }

    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    export function showAxis ( axis: Axis ) {
        var $axis: HTMLDivElement;

        switch( true ) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
                break;
        }

        if ( ! new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className) ) {
            $axis.className += ' ' + showAxisClass;
        }
    }

    /**
     * Hide axis - will choose axis by given parameter
     * @param axis
     */
    export function hideAxis ( axis: Axis ) {
        var $axis: HTMLDivElement;
        var className = 'show';

        switch( true ) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
        }

        if ( new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + className + '(\\b|$)', 'gi'), '');
        }
    }

    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    export function toggleAxis ( axis: Axis ) {
        var $axis: HTMLDivElement;

        switch( true ) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
        }

        if ( new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        } else {
            $axis.className += ' ' + showAxisClass;
        }
    }

    /**
     * Creating Y axis
     */
    function createScoreAxis() {
        $scoreAxis = document.createElement('div');
        $scoreAxis.setAttribute('id', 'scoreAxis-group');
        $scoreAxis.setAttribute('class', 'axis-group y-axis');
        $scoreAxis.style.top = ( Paper.getPaperSize().height / 10 ) * 2 + 'px';

        document.body.appendChild( $scoreAxis );

        for ( var i=4; i>0; i-- ) {
            var $text: HTMLDivElement = document.createElement('div');

            $text.setAttribute('class', 'score');
            $text.appendChild( document.createTextNode( String(i) ) );
            if ( i != 4 ) $text.style.marginTop = ( Paper.getPaperSize().height / 10 ) * 2.2 + 'px';

            $scoreAxis.appendChild( $text );
        }
    }

    /**
     * Creating X axis
     */
    function createXaxis() {
        var years = Book.getYearsObject();

        $yearAxis = document.createElement('div');
        $yearAxis.setAttribute('id', 'yearAxis-group');
        $yearAxis.setAttribute('class', 'axis-group x-axis');

        document.body.appendChild( $yearAxis );

        for ( var key in years ) {
            if ( years.hasOwnProperty(key) && parseInt(key) == parseInt(key) ) {
                var $text: HTMLSpanElement = document.createElement('span');

                $text.setAttribute('class', 'year');
                $text.appendChild( document.createTextNode( key ) );

                $yearAxis.appendChild( $text );
            }
        }
    }

}