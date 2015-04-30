module Tooltip {

    var showTooltipClass:string = 'visible';
    var toolTipID:string = 'tool-tip';

    var $toolTip: HTMLElement = null;

    var currentBook:bookData = null;

    /**
     * Construct tooltip with new book data
     * @param book
     */
    export function constructTooltip( book: bookData ) {
        currentBook = book;
        $toolTip = document.getElementById( toolTipID );

        showTooltip();
    }

    /**
     * Dismantle (remove) tooltip from view
     */
    export function dismantleTooltip() {

        if ( $toolTip != null ) {
            hideTooltip();
        }

    }

    /**
     * Show tooltip in DOM
     */
    function showTooltip() {
        ( <HTMLBaseElement> $toolTip.getElementsByClassName('title')[0] ).innerHTML = currentBook.name;
        ( <HTMLBaseElement> $toolTip.getElementsByClassName('author')[0] ).innerHTML = currentBook.author;
        ( <HTMLBaseElement> $toolTip.getElementsByClassName('price')[0] ).innerHTML = currentBook.price.toFixed(2);
        ( <HTMLBaseElement> $toolTip.getElementsByClassName('avgScore')[0] ).innerHTML = currentBook.avgScore.toFixed(2);
        ( <HTMLBaseElement> $toolTip.getElementsByClassName('voters')[0] ).innerHTML = String(currentBook.voters);

        if ( ! new RegExp('(^| )' + showTooltipClass + '( |$)', 'gi').test($toolTip.className) ) {
            $toolTip.className += ' ' + showTooltipClass;
            document.addEventListener('mousemove', toolTipMove);

        }
    }

    function hideTooltip() {
        if ( new RegExp('(^| )' + showTooltipClass + '( |$)', 'gi').test($toolTip.className) ) {
            $toolTip.className = $toolTip.className.replace(new RegExp('(^|\\b) ' + showTooltipClass + '(\\b|$)', 'gi'), '');
            document.removeEventListener('mousemove', toolTipMove);
            $toolTip.style.left = '-500px';
        }
    }

    function toolTipMove(e) {
        // ToDo: on the right circles tooltip can appear outside of body. You need to move it left in order to see the content
        $toolTip.style.left = String( e.pageX + 3 ) + 'px';
        $toolTip.style.top = String(e.pageY + 3 ) + 'px';
    }
}