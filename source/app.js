/// <reference path="d.ts/d3.d.ts" />
/// <reference path="../vendor/promise.d.ts" />
/// <reference path="classes/BookModule.ts" />
var Book = require('classes/BookModule');
promise.get('data/books_rnd.json')
    .then(function (error, data) {
    var graph = JSON.parse(data);
    var width = 960, height = 800;
    console.log(Book.getBookRadius());
    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height])
        .nodes(graph.Books)
        .start();
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    var maxRadius = 5;
    var node = svg.selectAll(".node")
        .data(graph.Books)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", maxRadius)
        .style("fill", "steelblue")
        .call(force.drag);
    node.append("title")
        .text(function (d) { return d.name; });
    force.on("tick", function () {
        /*link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });*/
        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    });
});
d3.json("data/books_rnd.json", function (error, graph) {
});
//# sourceMappingURL=app.js.map