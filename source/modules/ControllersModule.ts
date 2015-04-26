module Controllers {

    /**
     * Controller values.
     */
    export enum contValues { all, score, year }

    var currentContValue: contValues = contValues.all;

    /**
     * Bond click events to the button controllers
     * @param force
     */
    export function bindEvents( force ) {
        document.getElementById('controllers')
            .addEventListener('click', function(e){
                if ( e.srcElement.attributes.hasOwnProperty('data-show') ) {
                    removeActiveClass( this );
                    ( <HTMLBaseElement> e.srcElement ).className += ' active';
                    setCurrentContValue( e.srcElement.attributes['data-show'].nodeValue );
                    switch( true ) {
                        case currentContValue == contValues.score:
                            Axes.showAxis( Axes.Axis.y );
                            Axes.hideAxis( Axes.Axis.x );
                            break;
                        case currentContValue == contValues.year:
                            Axes.showAxis( Axes.Axis.y );
                            Axes.showAxis( Axes.Axis.x );
                            break;
                        default:
                            Axes.hideAxis( Axes.Axis.y );
                            Axes.hideAxis( Axes.Axis.x );
                    }
                }
                force.start();
            }, false);
    }

    /**
     * Return controller value
     * @returns {contValues}
     */
    export function getCurrentContValue(): contValues { return currentContValue; }

    /**
     * Set controller value
     * @param value
     */
    export function setCurrentContValue( value:string ) { currentContValue = contValues[ value ]; }

    /**
     * Remove class 'active' from all buttons
     * @param $controllers
     */
    function removeActiveClass( $controllers:HTMLBaseElement ) {
        var buttons = $controllers.children;
        var className = 'active';
        for ( var i=0, len=buttons.length; i<len; i++ ) {
            var el = <HTMLBaseElement> buttons[i];
            if ( el.classList )
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}