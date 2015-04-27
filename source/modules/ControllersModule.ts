module Controllers {

    /**
     * Controller values.
     */
    export enum contValues { all, score, year, price }

    var currentContValueX: contValues = contValues.all;
    var currentContValueY: contValues = contValues.all;

    var activeClass = 'active';

    /**
     * Bond click events to the button controllers
     * @param force
     */
    export function bindEvents( force ) {
        document.getElementById('controllers')
            .addEventListener('click', function(e){
                if ( e.srcElement.attributes.hasOwnProperty('data-show') ) {
                    var $btn = ( <HTMLBaseElement> e.srcElement );

                    // Check that source element has no active class and if no add one
                    if ( ! new RegExp('(^| )' + activeClass + '( |$)', 'gi').test($btn.className) )
                        $btn.className += ' ' + activeClass;
                    else
                        // else remove active class from the element
                        $btn.className = $btn.className.replace(new RegExp('(^|\\b) ' + activeClass + '(\\b|$)', 'gi'), '');

                    // Setting current controller value
                    toggleCurrentContValue(
                        $btn.parentNode.attributes['data-axis'].nodeValue, // axis - X or Y
                        e.srcElement.attributes['data-show'].nodeValue // data - all, score, year
                    );


                    // Switching Y axes
                    switch( true ) {
                        case currentContValueY == contValues.score:
                            Axes.showAxis( Axes.Axis.score );
                            break;
                        default:
                            Axes.hideAxis( Axes.Axis.score );
                    }

                    // Switching X axes
                    switch( true ) {
                        case currentContValueX == contValues.year:
                            Axes.showAxis( Axes.Axis.year );
                            break;
                        case currentContValueX == contValues.price:
                            break;
                        default:
                            Axes.hideAxis( Axes.Axis.year );
                    }

                    force.start();
                }
            }, false);
    }

    /**
     * Return controller value
     * @returns {*}
     */
    export function getCurrentContValue() {
        return {
            x: currentContValueX,
            y: currentContValueY
        };
    }

    /**
     * Set controller value
     * @param valueType {string} - X or Y
     * @param value
     */
    export function toggleCurrentContValue( valueType:string, value:string ) {
        switch (true) {
            case valueType == 'x':
                if ( currentContValueX != contValues[ value ] )
                    currentContValueX = contValues[ value ];
                else
                    currentContValueX = contValues.all;
                break;
            case valueType == 'y':
                if ( currentContValueY != contValues[ value ] )
                    currentContValueY = contValues[ value ];
                else
                    currentContValueY = contValues.all;
                break;
        }
    }

}