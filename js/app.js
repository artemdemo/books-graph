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
    var maxRadius = 35;
    var relativeMaxRadius = 1;
    var years;
    var prices;
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
     * @param books
     * @returns {bookData[]}
     */
    function addSpecialData(books) {
        years = {
            length: 0
        };
        prices = {
            length: 0
        };
        for (var i = 0, len = books.length; i < len; i++) {
            var voters = 0;
            books[i].avgScore = getAvgScore(books[i]);
            for (var key in books[i].score) {
                if (books[i].score.hasOwnProperty(key))
                    voters += books[i].score[key];
            }
            books[i].voters = voters;
            if (years.hasOwnProperty(String(books[i].year))) {
                years[books[i].year].voters++;
            }
            else {
                years[books[i].year] = {
                    voters: 0,
                    index: 0
                };
                years.length++;
            }
            if (prices.hasOwnProperty(String(getRoundedPrice(books[i].price)))) {
                prices[getRoundedPrice(books[i].price)].members++;
            }
            else {
                prices[getRoundedPrice(books[i].price)] = {
                    members: 1,
                    index: 0
                };
                prices.length++;
            }
        }
        // Now I need to add index to each year.
        // It will solve problem related to the fact that I have no idea how many years there is and what is index each of them
        // Index I need to determine position of each year
        var yearsIndex = 0;
        for (var key in years) {
            if (years.hasOwnProperty(key)) {
                if (years[key].hasOwnProperty('index')) {
                    years[key].index = yearsIndex;
                    yearsIndex++;
                }
            }
        }
        // Same thing for the price list
        var priceIndex = 0;
        for (var key in prices) {
            if (prices.hasOwnProperty(key)) {
                if (prices[key].hasOwnProperty('index')) {
                    prices[key].index = priceIndex;
                    priceIndex++;
                }
            }
        }
        return books;
    }
    Book.addSpecialData = addSpecialData;
    /**
     * Generate class for each circle in graph
     * @param book
     * @returns {string}
     */
    function getCircleClass(book) {
        var avgScore = book.hasOwnProperty('avgScore') ? book.avgScore : getAvgScore(book);
        var avgScore_floor = Math.floor(avgScore);
        var avgScore_group = Math.floor((avgScore - avgScore_floor) * 10);
        var className;
        className = 'book-node score-' + String(avgScore_floor);
        className += ' group-' + String(avgScore_group);
        return className;
    }
    Book.getCircleClass = getCircleClass;
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
     * Determine density of the circle
     * @param book
     * @returns {number}
     */
    function getCharge(book) {
        return book.voters * -0.9;
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
     * Return years object
     * @returns {*}
     */
    function getYearsObject() { return years; }
    Book.getYearsObject = getYearsObject;
    /**
     * Return prices object
     * @returns {*}
     */
    function getPricesObject() { return prices; }
    Book.getPricesObject = getPricesObject;
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
     * Round whole number
     * 25.6 -> 30
     * 124.3 -> 120
     * @param price
     * @returns {number}
     */
    function getRoundedPrice(price) {
        var priceStr = String(Math.round(price));
        var lastNum = parseInt(priceStr.slice(-1));
        var result;
        if (lastNum > 4)
            result = parseInt(priceStr) + (10 - lastNum);
        else
            result = parseInt(priceStr) - lastNum;
        return result;
    }
    /**
     * Calculate Y of the center
     * @param book
     * @returns {number}
     */
    function getYcenter(book) {
        var y = Paper.getPaperSize().height / 2;
        if (Controllers.getCurrentContValue().y == Controllers.contValues.score) {
            if (Math.floor(book.avgScore) == 1) {
                y = (Paper.getPaperSize().height / 10) * 9;
            }
            else {
                var id = 5 - Math.floor(book.avgScore);
                y = (Paper.getPaperSize().height / 10) * (2 * id + 1);
            }
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
        var xValueArr;
        var xValueData;
        if (Controllers.getCurrentContValue().x == Controllers.contValues.year) {
            xValueData = years[book.year];
            xValueArr = years;
        }
        else if (Controllers.getCurrentContValue().x == Controllers.contValues.price) {
            xValueData = prices[getRoundedPrice(book.price)];
            xValueArr = prices;
        }
        if (xValueData == undefined) {
            x = Paper.getPaperSize().width / 2;
        }
        else if (xValueData.index == 0) {
            x = Paper.getPaperSize().width / (xValueArr.length * 2);
        }
        else {
            x = (Paper.getPaperSize().width / (xValueArr.length * 2)) * (2 * xValueData.index + 1);
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
        contValues[contValues["score"] = 1] = "score";
        contValues[contValues["year"] = 2] = "year";
        contValues[contValues["price"] = 3] = "price";
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
                    case currentContValueY == contValues.score:
                        Axes.showAxis(Axes.Axis.score);
                        break;
                    default:
                        Axes.hideAxis(Axes.Axis.score);
                }
                // Switching X axes
                switch (true) {
                    case currentContValueX == contValues.year:
                        Axes.showAxis(Axes.Axis.year);
                        Axes.hideAxis(Axes.Axis.price);
                        break;
                    case currentContValueX == contValues.price:
                        Axes.hideAxis(Axes.Axis.year);
                        Axes.showAxis(Axes.Axis.price);
                        break;
                    default:
                        Axes.hideAxis(Axes.Axis.year);
                        Axes.hideAxis(Axes.Axis.price);
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
    var $scoreAxis;
    var $yearAxis;
    var $priceAxis;
    var showAxisClass = 'visible';
    (function (Axis) {
        Axis[Axis["year"] = 0] = "year";
        Axis[Axis["score"] = 1] = "score";
        Axis[Axis["price"] = 2] = "price";
    })(Axes.Axis || (Axes.Axis = {}));
    var Axis = Axes.Axis;
    /**
     * Adding axis to the graph
     */
    function addAxes() {
        createScoreAxis();
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
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
                break;
            case axis == Axis.price:
                $axis = $priceAxis;
                break;
        }
        return $axis;
    }
    /**
     * Creating Score axis - Y
     */
    function createScoreAxis() {
        $scoreAxis = document.createElement('div');
        $scoreAxis.setAttribute('id', 'scoreAxis-group');
        $scoreAxis.setAttribute('class', 'axis-group y-axis');
        $scoreAxis.style.top = (Paper.getPaperSize().height / 10) * 2 + 'px';
        document.body.appendChild($scoreAxis);
        for (var i = 4; i > 0; i--) {
            var $text = document.createElement('div');
            $text.setAttribute('class', 'score');
            $text.appendChild(document.createTextNode(String(i)));
            if (i != 4)
                $text.style.marginTop = (Paper.getPaperSize().height / 10) * 2.2 + 'px';
            $scoreAxis.appendChild($text);
        }
    }
    /**
     * Creating Years axis - X
     */
    function createYearsAxis() {
        var years = Book.getYearsObject();
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
        var prices = Book.getPricesObject();
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
        $toolTip.getElementsByClassName('title')[0].innerHTML = currentBook.name;
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
/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="modules/PaperModule.ts" />
/// <reference path="modules/BookModule.ts" />
/// <reference path="modules/ControllersModule.ts" />
/// <reference path="modules/AxesModule.ts" />
/// <reference path="modules/TooltipModule.ts" />
promise.get('data/books_rnd_1.json')
    .then(function (error, data) {
    var graph = JSON.parse(data);
    var width = Paper.getPaperSize().width, height = Paper.getPaperSize().height;
    var force, svg, node;
    /*
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     */
    graph.Books = Book.addSpecialData(graph.Books);
    force = d3.layout.force()
        .charge(Book.getCharge)
        .linkDistance(10)
        .size([width, height])
        .nodes(graph.Books)
        .start();
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    Book.calculateRelativeMaxRadius(graph.Books);
    node = svg.selectAll(".node")
        .data(graph.Books)
        .enter().append("circle")
        .attr("class", function (d) { return Book.getCircleClass(d); })
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
    // Binding events to controll buttons
    Controllers.bindEvents(force);
    // Adding axes
    Axes.addAxes();
});
//# sourceMappingURL=app.js.map