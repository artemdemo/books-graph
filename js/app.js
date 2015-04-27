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
        }
        // Now I need to add index to each year.
        // It will solve problem related to the fact tha I have no idea how many years there is and what is index each of them
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
    function onMouseEnter(book) {
        var $circle = document.getElementById(book.id);
        //$circle.setAttribute('class', $circle.getAttribute('class') + ' active' );
    }
    Book.onMouseEnter = onMouseEnter;
    function onMouseLeave(book) {
        var $circle = document.getElementById(book.id);
        var className = $circle.getAttribute('class');
        className = className.replace(new RegExp('(^|\\b)' + 'active'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        //$circle.setAttribute('class', className );
    }
    Book.onMouseLeave = onMouseLeave;
    /**
     * Return years object
     * @returns {*}
     */
    function getYearsObject() { return years; }
    Book.getYearsObject = getYearsObject;
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
        var x = Paper.getPaperSize().width / 2;
        if (Controllers.getCurrentContValue().x == Controllers.contValues.year) {
            var yearData = years[book.year];
            if (yearData.index == 0) {
                x = Paper.getPaperSize().width / (years.length * 2);
            }
            else {
                x = (Paper.getPaperSize().width / (years.length * 2)) * (2 * yearData.index + 1);
            }
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
                        break;
                    case currentContValueX == contValues.price:
                        break;
                    default:
                        Axes.hideAxis(Axes.Axis.year);
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
})(Controllers || (Controllers = {}));
var Axes;
(function (Axes) {
    var $yearAxis;
    var $scoreAxis;
    var showAxisClass = 'show';
    (function (Axis) {
        Axis[Axis["year"] = 0] = "year";
        Axis[Axis["score"] = 1] = "score";
    })(Axes.Axis || (Axes.Axis = {}));
    var Axis = Axes.Axis;
    /**
     * Adding axis to the graph
     */
    function addAxes() {
        createXaxis();
        createScoreAxis();
    }
    Axes.addAxes = addAxes;
    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    function showAxis(axis) {
        var $axis;
        switch (true) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
                break;
        }
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
        var $axis;
        var className = 'show';
        switch (true) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
        }
        if (new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + className + '(\\b|$)', 'gi'), '');
        }
    }
    Axes.hideAxis = hideAxis;
    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    function toggleAxis(axis) {
        var $axis;
        switch (true) {
            case axis == Axis.year:
                $axis = $yearAxis;
                break;
            case axis == Axis.score:
                $axis = $scoreAxis;
        }
        if (new RegExp('(^| )' + showAxisClass + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b) ' + showAxisClass + '(\\b|$)', 'gi'), '');
        }
        else {
            $axis.className += ' ' + showAxisClass;
        }
    }
    Axes.toggleAxis = toggleAxis;
    /**
     * Creating Y axis
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
     * Creating X axis
     */
    function createXaxis() {
        var years = Book.getYearsObject();
        $yearAxis = document.createElement('div');
        $yearAxis.setAttribute('id', 'yearAxis-group');
        $yearAxis.setAttribute('class', 'axis-group x-axis');
        document.body.appendChild($yearAxis);
        for (var key in years) {
            if (years.hasOwnProperty(key) && parseInt(key) == parseInt(key)) {
                var $text = document.createElement('span');
                $text.setAttribute('class', 'year');
                $text.appendChild(document.createTextNode(key));
                $yearAxis.appendChild($text);
            }
        }
    }
})(Axes || (Axes = {}));
/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="modules/PaperModule.ts" />
/// <reference path="modules/BookModule.ts" />
/// <reference path="modules/ControllersModule.ts" />
/// <reference path="modules/AxesModule.ts" />
promise.get('data/books_rnd.json')
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