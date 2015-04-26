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
            if (years[key].hasOwnProperty('index')) {
                years[key].index = yearsIndex;
                yearsIndex++;
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
                x: Paper.getPaperSize().width / 2,
                y: Paper.getPaperSize().height / 2
            };
            if (Controllers.getCurrentContValue() == Controllers.contValues.score) {
                center = getScoreCenter(d);
            }
            else if (Controllers.getCurrentContValue() == Controllers.contValues.year) {
                center = getYearCenter(d);
            }
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
     * @returns {any}
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
            score += parseInt(key) * book.score[key];
            voters += book.score[key];
        }
        if (voters > 0)
            score = score / voters;
        return score;
    }
    /**
     * Calculate center position if filtered by score
     * @param book
     * @returns {{x: number, y: number}}
     */
    function getScoreCenter(book) {
        var center = {
            x: Paper.getPaperSize().width / 2,
            y: Paper.getPaperSize().height / 2
        };
        if (Math.floor(book.avgScore) == 1) {
            center.y = (Paper.getPaperSize().height / 10) * 9;
        }
        else {
            var id = 5 - Math.floor(book.avgScore);
            center.y = (Paper.getPaperSize().height / 10) * (2 * id + 1);
        }
        return center;
    }
    /**
     * Calculate center position if filtered by score and year
     * @param book
     * @returns {{x: number, y: number}}
     */
    function getYearCenter(book) {
        var yearData = years[book.year];
        var center = {
            x: Paper.getPaperSize().width / 2,
            y: Paper.getPaperSize().height / 2
        };
        if (Math.floor(book.avgScore) == 1) {
            center.y = (Paper.getPaperSize().height / 10) * 9;
        }
        else {
            var id = 5 - Math.floor(book.avgScore);
            center.y = (Paper.getPaperSize().height / 10) * (2 * id + 1);
        }
        if (yearData.index == 0) {
            center.x = Paper.getPaperSize().width / (years.length * 2);
        }
        else {
            center.x = (Paper.getPaperSize().width / (years.length * 2)) * (2 * yearData.index + 1);
        }
        return center;
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
    })(Controllers.contValues || (Controllers.contValues = {}));
    var contValues = Controllers.contValues;
    var currentContValue = contValues.all;
    /**
     * Bond click events to the button controllers
     * @param force
     */
    function bindEvents(force) {
        document.getElementById('controllers')
            .addEventListener('click', function (e) {
            if (e.srcElement.attributes.hasOwnProperty('data-show')) {
                removeActiveClass(this);
                e.srcElement.className += ' active';
                setCurrentContValue(e.srcElement.attributes['data-show'].nodeValue);
                switch (true) {
                    case currentContValue == contValues.score:
                        Axes.showAxis(Axes.Axis.y);
                        Axes.hideAxis(Axes.Axis.x);
                        break;
                    case currentContValue == contValues.year:
                        Axes.showAxis(Axes.Axis.y);
                        Axes.showAxis(Axes.Axis.x);
                        break;
                    default:
                        Axes.hideAxis(Axes.Axis.y);
                        Axes.hideAxis(Axes.Axis.x);
                }
            }
            force.start();
        }, false);
    }
    Controllers.bindEvents = bindEvents;
    /**
     * Return controller value
     * @returns {contValues}
     */
    function getCurrentContValue() { return currentContValue; }
    Controllers.getCurrentContValue = getCurrentContValue;
    /**
     * Set controller value
     * @param value
     */
    function setCurrentContValue(value) { currentContValue = contValues[value]; }
    Controllers.setCurrentContValue = setCurrentContValue;
    /**
     * Remove class 'active' from all buttons
     * @param $controllers
     */
    function removeActiveClass($controllers) {
        var buttons = $controllers.children;
        var className = 'active';
        for (var i = 0, len = buttons.length; i < len; i++) {
            var el = buttons[i];
            if (el.classList)
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
})(Controllers || (Controllers = {}));
var Axes;
(function (Axes) {
    var $xAxis;
    var $yAxis;
    (function (Axis) {
        Axis[Axis["x"] = 0] = "x";
        Axis[Axis["y"] = 1] = "y";
    })(Axes.Axis || (Axes.Axis = {}));
    var Axis = Axes.Axis;
    /**
     * Adding axis to the graph
     */
    function addAxes() {
        createXaxis();
        createYaxis();
    }
    Axes.addAxes = addAxes;
    /**
     * Show axis - will choose axis by given parameter
     * @param axis
     */
    function showAxis(axis) {
        var $axis;
        var className = 'show';
        switch (true) {
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }
        if (!new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className)) {
            $axis.className += ' ' + className;
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
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }
        if (new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    Axes.hideAxis = hideAxis;
    /**
     * Toggle axis - will choose axis by given parameter
     * @param axis
     */
    function toggleAxis(axis) {
        var $axis;
        var className = 'show';
        switch (true) {
            case axis == Axis.x:
                $axis = $xAxis;
                break;
            default:
                $axis = $yAxis;
        }
        if (new RegExp('(^| )' + className + '( |$)', 'gi').test($axis.className)) {
            $axis.className = $axis.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
        else {
            $axis.className += ' ' + className;
        }
    }
    Axes.toggleAxis = toggleAxis;
    /**
     * Creating Y axis
     */
    function createYaxis() {
        $yAxis = document.createElement('div');
        $yAxis.setAttribute('id', 'yAxis-group');
        $yAxis.setAttribute('class', 'axis-group');
        $yAxis.style.top = (Paper.getPaperSize().height / 10) * 2 + 'px';
        document.body.appendChild($yAxis);
        for (var i = 4; i > 0; i--) {
            var $text = document.createElement('div');
            $text.setAttribute('class', 'score');
            $text.appendChild(document.createTextNode(String(i)));
            if (i != 4)
                $text.style.marginTop = (Paper.getPaperSize().height / 10) * 2.2 + 'px';
            $yAxis.appendChild($text);
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
        document.body.appendChild($xAxis);
        for (var key in years) {
            if (years.hasOwnProperty(key) && parseInt(key) == parseInt(key)) {
                var $text = document.createElement('span');
                $text.setAttribute('class', 'year');
                $text.appendChild(document.createTextNode(key));
                $xAxis.appendChild($text);
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