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

                    removeActiveClassInGroup( $btn.parentElement.children );

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
                            Axes.hideAxis( Axes.Axis.price );
                            break;
                        case currentContValueX == contValues.price:
                            Axes.hideAxis( Axes.Axis.year );
                            Axes.showAxis( Axes.Axis.price );
                            break;
                        default:
                            Axes.hideAxis( Axes.Axis.year );
                            Axes.hideAxis( Axes.Axis.price );
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

    /**
     * Remove activeClass from all buttons in given list.
     * If list contain less then 2 elements - do nothing and return false.
     * Otherwise button will always be pressed
     * @param nodeList
     * @returns {boolean}
     */
    function removeActiveClassInGroup( nodeList: NodeList ) {
        if ( nodeList.length < 2 ) return false;

        for ( var i=0, len=nodeList.length; i<len; i++ ) {
            var $btn = <HTMLButtonElement> nodeList[i];
            $btn.className = $btn.className.replace(new RegExp('(^|\\b) ' + activeClass + '(\\b|$)', 'gi'), '');
        }

        return true;
    }

}