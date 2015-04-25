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
     * Add special data to each item to make live easier:
     *  avgScore - average score of the book
     *  voters - number of voters
     * @param books
     * @returns {bookData[]}
     */
    function addSpecialData(books) {
        for (var i = 0, len = books.length; i < len; i++) {
            var voters = 0;
            books[i].avgScore = getAvgScore(books[i]);
            for (var key in books[i].score) {
                voters += books[i].score[key];
            }
            books[i].voters = voters;
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
        className = 'score-' + String(avgScore_floor);
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
            var a;
            Controllers.getCurrentContValue();
            d.x += (center.x - d.x) * 0.1 * alpha;
            d.y += (center.y - d.y) * 0.1 * alpha;
        };
    }
    Book.moveTowardCenter = moveTowardCenter;
    /**
     * Determine density of the circle
     * @param d
     * @returns {number}
     */
    function getCharge(d) {
        return d.voters * -0.9;
    }
    Book.getCharge = getCharge;
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
            }
            force.start();
        }, false);
    }
    Controllers.bindEvents = bindEvents;
    function getCurrentContValue() { return currentContValue; }
    Controllers.getCurrentContValue = getCurrentContValue;
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
/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="modules/PaperModule.ts" />
/// <reference path="modules/BookModule.ts" />
/// <reference path="modules/ControllersModule.ts" />
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
        .call(force.drag);
    node.append("title")
        .text(function (d) { return d.name; });
    force.on("tick", function (e) {
        node.each(Book.moveTowardCenter(e.alpha));
        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    });
    /*
     * Bind events to the buttons
     */
    Controllers.bindEvents(force);
});
//# sourceMappingURL=app.js.map