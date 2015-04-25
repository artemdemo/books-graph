
module Paper {
    var width:number = window.innerWidth - 10;
    var height:number = window.innerHeight - document.getElementById('controllers').clientHeight - 10;

    /**
     * Return calculated paper size - width and height
     * @returns {{width: number, height: number}}
     */
    export function getPaperSize() {
        return {
            width: width,
            height: height
        }
    }
}