var Paper;
(function (Paper) {
    var width = window.innerWidth - 10;
    var height = window.innerHeight - document.getElementById('controllers').clientHeight - 10;
    /**
     * Return calculated paper size - width and height
     * @returns {{width: number, height: number}}
     */
    function getPaperSize() {
        return {
            width: width,
            height: height
        };
    }
    Paper.getPaperSize = getPaperSize;
})(Paper || (Paper = {}));
var Book;
(function (Book) {
    var maxRadius = 55;
    var relativeMaxRadius = 1;
    var scores;
    /**
     * Get all books data and calculate max radius (total number of votes) based on it's data.
     * @param books
     */
    function calculateRelativeMaxRadius(books) {
        for (var i = 0, len = books.length; i < len; i++) {
            var book = books[i];
            var radius = 0;
            for (var key in book.score) {
                if (book.score.hasOwnProperty(key))
                    radius += book.score[key];
            }
            if (radius > relativeMaxRadius)
                relativeMaxRadius = radius;
        }
    }
    Book.calculateRelativeMaxRadius = calculateRelativeMaxRadius;
    /**
     * Receive book and convert radius based on maximum and relative
     * @param book
     * @returns {number}
     */
    function getBookRadius(book) {
        var radius = 0;
        if (book.hasOwnProperty('voters'))
            radius = book.voters;
        else
            for (var key in book.score) {
                if (book.score.hasOwnProperty(key))
                    radius += book.score[key];
            }
        return radius / relativeMaxRadius * maxRadius;
    }
    Book.getBookRadius = getBookRadius;
    /**
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     *  also save data for each year
     *  get min and max scores
     * @param books
     * @returns {bookData[]}
     */
    function addSpecialData(books) {
        // Min and max scores will help to separate nodes by score.
        // I need it, case I can't assume that it will be from 1 to 5 [sad face]
        var minScore = null;
        var maxScore = null;
        for (var i = 0, len = books.length; i < len; i++) {
            var voters = 0;
            // Add average score if it's missing
            if (!books[i].hasOwnProperty('avgScore'))
                books[i].avgScore = getAvgScore(books[i]);
            // If there is 'null' I will convert it to 0
            books[i].price = !books[i].price ? 0 : books[i].price;
            // Save minimum and maximum score of all books
            if (minScore == null)
                minScore = books[i].avgScore;
            else if (books[i].avgScore < minScore)
                minScore = books[i].avgScore;
            if (maxScore == null)
                maxScore = books[i].avgScore;
            else if (books[i].avgScore > maxScore)
                maxScore = books[i].avgScore;
            // Calculate and add number of voters
            for (var key in books[i].score) {
                if (books[i].score.hasOwnProperty(key))
                    voters += books[i].score[key];
            }
            books[i].voters = voters;
        }
        Prices.create(books);
        Years.create(books);
        AvgScores.create(books);
        return books;
    }
    Book.addSpecialData = addSpecialData;
    /**
     * Organise all dots in one center
     * @param alpha
     * @returns {*}
     */
    function moveTowardCenter(alpha) {
        return function (d) {
            var center = {
                x: getXcenter(d),
                y: getYcenter(d)
            };
            d.x += (center.x - d.x) * 0.1 * alpha;
            d.y += (center.y - d.y) * 0.1 * alpha;
        };
    }
    Book.moveTowardCenter = moveTowardCenter;
    /**
     * Determine density of the circles
     * @param book
     * @returns {number}
     */
    function getCharge(book) {
        return book.voters * -0.5;
    }
    Book.getCharge = getCharge;
    /**
     * On mouse enter book circle
     * @param book
     */
    function onMouseEnter(book) {
        Tooltip.constructTooltip(book);
    }
    Book.onMouseEnter = onMouseEnter;
    /**
     * On mouse leave book circle
     * @param book
     */
    function onMouseLeave(book) {
        Tooltip.dismantleTooltip();
    }
    Book.onMouseLeave = onMouseLeave;
    /**
     * Calculate avg score of given book
     * @param book
     * @returns {number}
     */
    function getAvgScore(book) {
        var score = 0;
        var voters = 0;
        for (var key in book.score) {
            if (book.score.hasOwnProperty(key)) {
                score += parseInt(key) * book.score[key];
                voters += book.score[key];
            }
        }
        if (voters > 0)
            score = score / voters;
        return score;
    }
    /**
     * Set class for given circle in graph (by it's ID)
     * @param circleID {string}
     * @param className {string}
     * @returns {string}
     */
    function setCircleClass(circleID, className) {
        var $circle = document.getElementById(circleID);
        $circle.setAttribute('class', 'book-node ' + className);
        return true;
    }
    /**
     * Calculate Y of the center
     * @param book
     * @returns {number}
     */
    function getYcenter(book) {
        var y;
        var yValueIndex;
        var yValueLength;
        if (Controllers.getCurrentContValue().y == Controllers.contValues.avgScore) {
            yValueIndex = AvgScores.getDataIndex(book.avgScore);
            yValueLength = AvgScores.getDataLength();
        }
        else if (Controllers.getCurrentContValue().y == Controllers.contValues.artScore) {
        }
        // Add "score" class to the node, based on it's index
        var scoreIndex = 4 - AvgScores.getDataIndex(book.avgScore);
        setCircleClass(book.id, 'score-' + scoreIndex);
        if (yValueIndex == undefined) {
            y = Paper.getPaperSize().height / 2;
        }
        else if (yValueIndex == 0) {
            y = Paper.getPaperSize().height / (yValueLength * 2);
        }
        else {
            y = (Paper.getPaperSize().height / (yValueLength * 2)) * (2 * yValueIndex + 1);
        }
        return y;
    }
    /**
     * Calculate X of the center
     * @param book
     * @returns {number}
     */
    function getXcenter(book) {
        var x;
        var xValueLength;
        var xValueIndex;
        if (Controllers.getCurrentContValue().x == Controllers.contValues.year) {
            xValueIndex = Years.getDataIndex(book.year);
            xValueLength = Years.getDataLength();
        }
        else if (Controllers.getCurrentContValue().x == Controllers.contValues.price) {
            xValueIndex = Prices.getDataIndex(book.price);
            xValueLength = Prices.getDataLength();
        }
        if (xValueIndex == undefined) {
            x = Paper.getPaperSize().width / 2;
        }
        else if (xValueIndex == 0) {
            x = Paper.getPaperSize().width / (xValueLength * 2);
        }
        else {
            x = (Paper.getPaperSize().width / (xValueLength * 2)) * (2 * xValueIndex + 1);
        }
        return x;
    }
})(Book || (Book = {}));
var Controllers;
(function (Controllers) {
    /**
     * Controller values.
     */
    (function (contValues) {
        contValues[contValues["all"] = 0] = "all";
        contValues[contValues["avgScore"] = 1] = "avgScore";
        contValues[contValues["artScore"] = 2] = "artScore";
        contValues[contValues["year"] = 3] = "year";
        contValues[contValues["price"] = 4] = "price";
    })(Controllers.contValues || (Controllers.contValues = {}));
    var contValues = Controllers.contValues;
    var currentContValueX = contValues.all;
    var currentContValueY = contValues.all;
    var activeClass = 'active';
    /**
     * Bond click events to the button controllers
     * @param force
     */
    function bindEvents(force) {
        document.getElementById('controllers')
            .addEventListener('click', function (e) {
            if (e.srcElement.attributes.hasOwnProperty('data-show')) {
                var $btn = e.srcElement;
                removeActiveClassInGroup($btn.parentElement.children);
                // Check that source element has no active class and if no add one
                if (!new RegExp('(^| )' + activeClass + '( |$)', 'gi').test($btn.className))
                    $btn.className += ' ' + activeClass;
                else
                    // else remove active class from the element
                    $btn.className = $btn.className.replace(new RegExp('(^|\\b) ' + activeClass + '(\\b|$)', 'gi'), '');
                // Setting current controller value
                toggleCurrentContValue($btn.parentNode.attributes['data-axis'].nodeValue, e.srcElement.attributes['data-show'].nodeValue // data - all, score, year
                );
                // Switching Y axes
                switch (true) {
                    case currentContValueY == contValues.avgScore:
                        Axes.showAxis(contValues.avgScore);
                        Axes.hideAxis(contValues.artScore);
                        break;
                    case currentContValueY == contValues.artScore:
                        Axes.hideAxis(contValues.avgScore);
                        Axes.showAxis(contValues.artScore);
                        break;
                    default:
                        Axes.hideAxis(contValues.avgScore);
                        Axes.hideAxis(contValues.artScore);
                }
                // Switching X axes
                switch (true) {
                    case currentContValueX == contValues.year:
                        Axes.showAxis(contValues.year);
                        Axes.hideAxis(contValues.price);
                        break;
                    case currentContValueX == contValues.price:
                        Axes.hideAxis(contValues.year);
                        Axes.showAxis(contValues.price);
                        break;
                    default:
                        Axes.hideAxis(contValues.year);
                        Axes.hideAxis(contValues.price);
                }
                force.start();
            }
        }, false);
    }
    Controllers.bindEvents = bindEvents;
    /**
     * Return controller value
     * @returns {*}
     */
    function getCurrentContValue() {
        return {
            x: currentContValueX,
            y: currentContValueY
        };
    }
    Controllers.getCurrentContValue = getCurrentContValue;
    /**
     * Set controller value
     * @param valueType {string} - X or Y
     * @param value
     */
    function toggleCurrentContValue(valueType, value) {
        switch (true) {
            case valueType == 'x':
                if (currentContValueX != contValues[value])
                    currentContValueX = contValues[value];
                else
                    currentContValueX = contValues.all;
                break;
            case valueType == 'y':
                if (currentContValueY != contValues[value])
                    currentContValueY = contValues[value];
                else
                    currentContValueY = contValues.all;
                break;
        }
    }
    Controllers.toggleCurrentContValue = toggleCurrentContValue;
    /**
     * Remove activeClass from all buttons in given list.
     * If list contain less then 2 elements - do nothing and return false.
     * Otherwise button will always be pressed
     * @param nodeList
     * @returns {boolean}
     */
    function removeActiveClassInGroup(nodeList) {
        if (nodeList.length < 2)
            return false;
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var $btn = nodeList[i];
            $btn.className = $btn.className.replace(new RegExp('(^|\\b) ' + activeClass + '(\\b|$)', 'gi'), '');
        }
        return true;
    }
})(Controllers || (Controllers = {}));
var Axes;
(function (Axes) {
    var $artScoreAxis;
    var $avgScoreAxis;
    var $yearAxis;
    var $priceAxis;
    var showAxisClass = 'visible';
    /**
     * Adding axis to the graph
     */
    function addAxes() {
        createAvgScoreAxis();
        createArtScoreAxis();
        createYearsAxis();
        createPriceAxis();
    }
    Axes.addAxes = addAxes;
    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    function showAxis(axis) {
        var $axis = getAxisNode(axis);
        if (!new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className)) {
            $axis.className += ' ' + showAxisClass;
        }
    }
    Axes.showAxis = showAxis;
    /**
     * Hide axis - will choose axis by given parameter
     * @param axis
     */
    function hideAxis(axis) {
        var $axis = getAxisNode(axis);
        if (new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        }
    }
    Axes.hideAxis = hideAxis;
    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    function toggleAxis(axis) {
        var $axis = getAxisNode(axis);
        if (new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        }
        else {
            $axis.className += ' ' + showAxisClass;
        }
    }
    Axes.toggleAxis = toggleAxis;
    function getAxisNode(axis) {
        var $axis;
        switch (true) {
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
        $artScoreAxis.style.top = (Paper.getPaperSize().height / 10) * 2 + 'px';
        document.body.appendChild($artScoreAxis);
        for (var i = 4; i > 0; i--) {
            var $text = document.createElement('div');
            $text.setAttribute('class', 'node score');
            $text.appendChild(document.createTextNode(String(i)));
            if (i != 4)
                $text.style.marginTop = (Paper.getPaperSize().height / 10) * 2.2 + 'px';
            $artScoreAxis.appendChild($text);
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
        document.body.appendChild($avgScoreAxis);
        for (var key in avgScores) {
            if (avgScores.hasOwnProperty(key) && parseInt(key) == parseInt(key)) {
                var $text = document.createElement('div');
                $text.setAttribute('class', 'node score');
                $text.appendChild(document.createTextNode(key));
                $avgScoreAxis.appendChild($text);
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
        document.body.appendChild($yearAxis);
        for (var key in years) {
            if (years.hasOwnProperty(key) && parseInt(key) == parseInt(key)) {
                var $text = document.createElement('span');
                $text.setAttribute('class', 'node year');
                $text.appendChild(document.createTextNode(key));
                $yearAxis.appendChild($text);
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
        document.body.appendChild($priceAxis);
        for (var key in prices) {
            if (prices.hasOwnProperty(key) && parseInt(key) == parseInt(key)) {
                var $text = document.createElement('span');
                $text.setAttribute('class', 'node price');
                $text.appendChild(document.createTextNode(key));
                $priceAxis.appendChild($text);
            }
        }
    }
})(Axes || (Axes = {}));
var Tooltip;
(function (Tooltip) {
    var showTooltipClass = 'visible';
    var toolTipID = 'tool-tip';
    var $toolTip = null;
    var currentBook = null;
    /**
     * Construct tooltip with new book data
     * @param book
     */
    function constructTooltip(book) {
        currentBook = book;
        $toolTip = document.getElementById(toolTipID);
        showTooltip();
    }
    Tooltip.constructTooltip = constructTooltip;
    /**
     * Dismantle (remove) tooltip from view
     */
    function dismantleTooltip() {
        if ($toolTip != null) {
            hideTooltip();
        }
    }
    Tooltip.dismantleTooltip = dismantleTooltip;
    /**
     * Show tooltip in DOM
     */
    function showTooltip() {
        $toolTip.getElementsByClassName('title')[0].innerHTML = currentBook.bookName;
        $toolTip.getElementsByClassName('author')[0].innerHTML = currentBook.author;
        $toolTip.getElementsByClassName('price')[0].innerHTML = currentBook.price.toFixed(2);
        $toolTip.getElementsByClassName('avgScore')[0].innerHTML = currentBook.avgScore.toFixed(2);
        $toolTip.getElementsByClassName('voters')[0].innerHTML = String(currentBook.voters);
        if (!new RegExp('(^| )' + showTooltipClass + '( |$)', 'gi').test($toolTip.className)) {
            $toolTip.className += ' ' + showTooltipClass;
            document.addEventListener('mousemove', toolTipMove);
        }
    }
    function hideTooltip() {
        if (new RegExp('(^| )' + showTooltipClass + '( |$)', 'gi').test($toolTip.className)) {
            $toolTip.className = $toolTip.className.replace(new RegExp('(^|\\b) ' + showTooltipClass + '(\\b|$)', 'gi'), '');
            document.removeEventListener('mousemove', toolTipMove);
            $toolTip.style.left = '-500px';
        }
    }
    function toolTipMove(e) {
        // ToDo: on the right circles tooltip can appear outside of body. You need to move it left in order to see the content
        $toolTip.style.left = String(e.pageX + 3) + 'px';
        $toolTip.style.top = String(e.pageY + 3) + 'px';
    }
})(Tooltip || (Tooltip = {}));
var PricesClass = (function () {
    function PricesClass() {
    }
    /**
     * Creating prices data
     * @param books
     */
    PricesClass.prototype.create = function (books) {
        this.prices = {
            length: 0
        };
        for (var i = 0, len = books.length; i < len; i++) {
            if (this.prices.hasOwnProperty(String(PricesClass.getRoundedPrice(books[i].price)))) {
                this.prices[PricesClass.getRoundedPrice(books[i].price)].members++;
            }
            else {
                this.prices[PricesClass.getRoundedPrice(books[i].price)] = {
                    members: 1,
                    index: 0
                };
                this.prices.length++;
            }
        }
        // Now I need to add index to each price.
        // It will solve problem related to the fact that I have no idea how many prices there is and what is index each of them
        // Index I need to determine position of each price on axis
        var priceIndex = 0;
        for (var key in this.prices) {
            if (this.prices.hasOwnProperty(key)) {
                if (this.prices[key].hasOwnProperty('index')) {
                    this.prices[key].index = priceIndex;
                    priceIndex++;
                }
            }
        }
    };
    /**
     * Return prices object
     * @returns {*}
     */
    PricesClass.prototype.getMainObject = function () { return this.prices; };
    /**
     * Return index of given price in array of Prices.
     * Will return undefined if there is no such price
     * @param bookPrice
     * @returns {number|undefined}
     */
    PricesClass.prototype.getDataIndex = function (bookPrice) {
        var priceData = this.prices[PricesClass.getRoundedPrice(bookPrice)];
        return !!priceData ? priceData.index : undefined;
    };
    /**
     * Return length of prices array
     * @returns {number}
     */
    PricesClass.prototype.getDataLength = function () { return this.prices.length; };
    /**
     * Round whole number
     * 25.6 -> 30
     * 124.3 -> 120
     * @param price
     * @private
     * @static
     * @returns {number}
     */
    PricesClass.getRoundedPrice = function (price) {
        var priceStr = String(Math.round(price));
        var lastNum = parseInt(priceStr.slice(-1));
        var result;
        if (lastNum > 4)
            result = parseInt(priceStr) + (10 - lastNum);
        else
            result = parseInt(priceStr) - lastNum;
        return result;
    };
    return PricesClass;
})();
var Prices = new PricesClass();
var YearsClass = (function () {
    function YearsClass() {
    }
    /**
     * Creating years data
     * @param books
     */
    YearsClass.prototype.create = function (books) {
        this.years = {
            length: 0
        };
        for (var i = 0, len = books.length; i < len; i++) {
            if (!books[i].year)
                continue;
            // Save year data in special object
            if (this.years.hasOwnProperty(String(books[i].year))) {
                this.years[books[i].year].voters++;
            }
            else {
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
        for (var key in this.years) {
            if (this.years.hasOwnProperty(key)) {
                if (this.years[key].hasOwnProperty('index')) {
                    this.years[key].index = yearsIndex;
                    yearsIndex++;
                }
            }
        }
    };
    /**
     * Return years object
     * @returns {*}
     */
    YearsClass.prototype.getMainObject = function () { return this.years; };
    /**
     * Return index of given year in array of Years.
     * Will return undefined if there is no such year
     * @param year
     * @returns {number|undefined}
     */
    YearsClass.prototype.getDataIndex = function (year) { return this.years[year].index; };
    /**
     * Return length of years array
     * @returns {number}
     */
    YearsClass.prototype.getDataLength = function () { return this.years.length; };
    return YearsClass;
})();
var Years = new YearsClass();
var AvgScoresClass = (function () {
    function AvgScoresClass() {
        this.scoreParts = 4;
        // Min and max scores will help to separate nodes by score.
        // I need it, case I can't assume that it will be from 1 to 5 [sad face]
        this.minAvgScore = null;
        this.maxAvgScore = null;
        this.partValue = null;
    }
    /**
     * Creating scores data
     * @param books
     */
    AvgScoresClass.prototype.create = function (books) {
        this.avgScores = {
            length: 0
        };
        for (var i = 0, len = books.length; i < len; i++) {
            // Save minimum and maximum average score of all books
            if (this.minAvgScore == null)
                this.minAvgScore = books[i].avgScore;
            else if (books[i].avgScore < this.minAvgScore)
                this.minAvgScore = books[i].avgScore;
            if (this.maxAvgScore == null)
                this.maxAvgScore = books[i].avgScore;
            else if (books[i].avgScore > this.maxAvgScore)
                this.maxAvgScore = books[i].avgScore;
        }
        this.partValue = (this.maxAvgScore - this.minAvgScore) / (this.scoreParts - 1);
        for (var i = 0, len = this.scoreParts; i < len; i++) {
            var score = this.roundScore(this.maxAvgScore - i * this.partValue);
            this.avgScores[score] = {
                index: i
            };
            this.avgScores.length++;
        }
    };
    /**
     * Return scores object
     * @returns {*}
     */
    AvgScoresClass.prototype.getMainObject = function () { return this.avgScores; };
    AvgScoresClass.prototype.getDataIndex = function (score) {
        var scoreData = this.roundScore(score);
        return this.avgScores[scoreData].index;
    };
    /**
     * Return length of scores array
     * @returns {number}
     */
    AvgScoresClass.prototype.getDataLength = function () { return this.avgScores.length; };
    AvgScoresClass.prototype.roundScore = function (score) {
        var times = Math.round((score - this.minAvgScore) / this.partValue);
        var result = this.minAvgScore + times * this.partValue;
        return result.toFixed(2);
    };
    return AvgScoresClass;
})();
var AvgScores = new AvgScoresClass();
/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="modules/PaperModule.ts" />
/// <reference path="modules/BookModule.ts" />
/// <reference path="modules/ControllersModule.ts" />
/// <reference path="modules/AxesModule.ts" />
/// <reference path="modules/TooltipModule.ts" />
/// <reference path="classes/PricesClass.ts" />
/// <reference path="classes/YearsClass.ts" />
/// <reference path="classes/AvgScoresClass.ts" />
// http://localhost:1337/books
promise.get('data/books.json')
    .then(function (error, data) {
    var graphBooks = JSON.parse(data);
    var width = Paper.getPaperSize().width, height = Paper.getPaperSize().height;
    var force, svg, node;
    /*
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     */
    graphBooks = Book.addSpecialData(graphBooks);
    force = d3.layout.force()
        .charge(Book.getCharge)
        .linkDistance(10)
        .size([width, height])
        .nodes(graphBooks)
        .start();
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    Book.calculateRelativeMaxRadius(graphBooks);
    node = svg.selectAll(".node")
        .data(graphBooks)
        .enter().append("circle")
        .attr("r", function (d) { return Book.getBookRadius(d); })
        .attr("id", function (d) { return d.id; })
        .call(force.drag)
        .on('mouseenter', Book.onMouseEnter)
        .on('mouseleave', Book.onMouseLeave);
    /*
    // Add <title></title> to circle node
    node.append("title")
        .text(function(d) { return d.name; });*/
    force.on("tick", function (e) {
        node.each(Book.moveTowardCenter(e.alpha));
        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    });
    // Binding events to control buttons
    Controllers.bindEvents(force);
    // Adding axes
    Axes.addAxes();
});
//# sourceMappingURL=app.js.map