/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="modules/PaperModule.ts" />
/// <reference path="modules/BookModule.ts" />
/// <reference path="modules/ControllersModule.ts" />


promise.get('data/books_rnd.json')
    .then(function(error, data){

        var graph: booksObject = JSON.parse(data);

        var width = Paper.getPaperSize().width,
            height = Paper.getPaperSize().height;

        var force, svg, node;

        /*
         * Add special data to each item to make live easier:
         *  avgScore - average score of the book
         *  voters - number of voters
         */
        graph.Books = Book.addSpecialData( graph.Books );

        force = d3.layout.force()
            .charge( Book.getCharge )
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
            .attr("class", function(d){ return Book.getCircleClass( <bookData>d ) })
            .attr("r", function(d){ return Book.getBookRadius( <bookData>d ) })
            .call(force.drag);

        node.append("title")
            .text(function(d) { return d.name; });

        force.on("tick", function(e) {
            node.each( Book.moveTowardCenter(e.alpha) );
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        /*
         * Bind events to the buttons
         */
        Controllers.bindEvents( force );

    });
