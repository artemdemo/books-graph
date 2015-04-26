module Axes {

    var $xAxis: HTMLDivElement;
    var $yAxis: HTMLDivElement;

    export enum Axis { x, y }

    /**
     * Adding axis to the graph
     */
    export function addAxes() {
        createXaxis();
        createYaxis();
    }

    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    export function showAxis ( axis: Axis ) {
        var $axis: HTMLDivElement;
        var className = 'show';

        switch( true ) {
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }

        if ( ! new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className) ) {
            $axis.className += ' ' + className;
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
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }

        if ( new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    export function toggleAxis ( axis: Axis ) {
        var $axis: HTMLDivElement;
        var className = 'show';

        switch( true ) {
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }

        if ( new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className) ) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        } else {
            $axis.className += ' ' + className;
        }
    }

    /**
     * Creating Y axis
     */
    function createYaxis() {
        $yAxis = document.createElement('div');
        $yAxis.setAttribute('id', 'yAxis-group');
        $yAxis.setAttribute('class', 'axis-group');
        $yAxis.style.top = ( Paper.getPaperSize().height / 10 ) * 2 + 'px';

        document.body.appendChild( $yAxis );

        for ( var i=4; i>0; i-- ) {
            var $text: HTMLDivElement = document.createElement('div');

            $text.setAttribute('class', 'score');
            $text.appendChild( document.createTextNode( String(i) ) );
            if ( i != 4 ) $text.style.marginTop = ( Paper.getPaperSize().height / 10 ) * 2.2 + 'px';

            $yAxis.appendChild( $text );
        }
    }

    /**
     * Creating X axis
     */
    function createXaxis() {
        var years = Book.getYearsObject();

        $xAxis = document.createElement('div');
        $xAxis.setAttribute('id', 'xAxis-group');
        $xAxis.setAttribute('class', 'axis-group');

        document.body.appendChild( $xAxis );

        for ( var key in years ) {
            if ( years.hasOwnProperty(key) && parseInt(key) == parseInt(key) ) {
                var $text: HTMLSpanElement = document.createElement('span');

                $text.setAttribute('class', 'year');
                $text.appendChild( document.createTextNode( key ) );

                $xAxis.appendChild( $text );
            }
        }
    }

}