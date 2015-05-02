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

// http://localhost:1337/books
promise.get('data/books.json')
    .then(function(error, data){

        var graphBooks: bookData[] = JSON.parse(data);

        var width = Paper.getPaperSize().width,
            height = Paper.getPaperSize().height;

        var force, svg, node;

        /*
         * Add special data to each item to make live easier:
         *  avgScore - average score of the book
         *  voters - number of voters
         */
        graphBooks = Book.addSpecialData( graphBooks );

        force = d3.layout.force()
            .charge( Book.getCharge )
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
            .attr("class", function(d){ return Book.getCircleClass( <bookData>d ) })
            .attr("r", function(d){ return Book.getBookRadius( <bookData>d ) })
            .attr("id", function(d){ return <bookData>d.id })
            .call(force.drag)
            .on('mouseenter', Book.onMouseEnter )
            .on('mouseleave', Book.onMouseLeave );

        /*
        // Add <title></title> to circle node
        node.append("title")
            .text(function(d) { return d.name; });*/

        force.on("tick", function(e) {
            node.each( Book.moveTowardCenter(e.alpha) );
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        // Binding events to control buttons
        Controllers.bindEvents( force );

        // Adding axes
        Axes.addAxes();

    });
