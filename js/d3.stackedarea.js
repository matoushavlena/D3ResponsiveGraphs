function D3StackedArea(options) {
	if (!(this instanceof D3StackedArea)) throw new TypeError("D3StackedArea constructor cannot be called as a function.");
    var defaultOptions = {
		container: "#stackedarea",
		spacing: 0.2,
		verticalText: null,
		tooltipOnMouseOver: function(d, element, base) { 		    
			var xPosition = parseInt($(element).attr("x")) + parseInt($(element).attr("width"))/2-base.tooltipWidth/2+base.options.margin.left;
			var yPosition = base.y.range()[0]-parseInt($(element).attr("y"))+base.options.margin.bottom+5;
			d3.select(base.options.container+" .tooltip")
				.style("left", xPosition + "px")
				.style("bottom", yPosition + "px")	
				.html(base.options.tooltipText(d, element));
			$(base.options.container+" .tooltip").show();
		},
		tooltipOnMouseOut: function(d, element, base) {
			$(base.options.container+" .tooltip").hide();
		}
	}	
	if (typeof options == 'object') this.options = $.extend(defaultOptions, options);
	else this.options = defaultOptions;
    D3Core.call(this, this.options);
}

inheritPrototype(D3StackedArea, D3Core);

D3StackedArea.prototype.prepareItem = function() {
	this.item = this.category.selectAll("rect")
		.data(function(d) { return d.values; });
}

D3StackedArea.prototype.itemEnter = function() {
	var base = this;
	base.item
		.enter().append("rect")
		.attr("x", function(d) { return base.x(d.x); })
		.attr("original-x", function(d) { return d.x; })
		.attr("original-y", function(d) { return d.y; })
		.attr("y", function(d) { return base.height; })   
		.attr("width", base.x.rangeBand())
		.attr("height", 0)
		.attr("class", "rect")
		.transition().delay(300).duration(500).ease("cubic-in-out")
		.attr("height", function(d) { return base.y(0)-base.y(d.size); })
		.attr("y", function(d) { return base.y(d.y0); });
}

D3StackedArea.prototype.itemUpdate = function() {
	var base = this;
	base.item
		.attr("original-x", function(d) { return d.x; })
		.attr("original-y", function(d) { return d.y; })	
		.transition().duration(500).ease("cubic-in-out")
		.attr("x", function(d) { return base.x(d.x); })
		.attr("y", function(d) { return base.y(d.y0); })
		.attr("height", function(d) { return base.y(0)-base.y(d.size); })
		.attr("width", base.x.rangeBand());
}

D3StackedArea.prototype.itemExit = function() {
	var base = this;
	base.item.exit()
	    .transition().duration(300).ease("cubic-in-out")
	    .attr("height", 0)
	    .attr("y", function(d) { return base.height; })  
	    .remove();
}

D3StackedArea.prototype.tooltipRender = function() {
	var base = this;
	base.item.on("mouseover", function(d) { base.options.tooltipOnMouseOver(d, this, base); });
	base.item.on("mouseout", function(d) { base.options.tooltipOnMouseOut(d, this, base); });
}

D3StackedArea.prototype.prepare = function() {
	D3Core.prototype.prepare.apply(this);
	var base = this;
    this.x = d3.time.scale().range([0, this.width]);
    this.parseDate = d3.time.format("%Y-%-m-%-d").parse;
	this.stack = d3.layout.stack().values(function(d) { return d.values; });
    this.area = d3.svg.area()
    	.interpolate("basis") 
        .x(function(d) { return base.x(d.date); })
        .y0(function(d) { return base.y(d.y0); })
        .y1(function(d) { return base.y(d.y0 + d.y); });
}

D3StackedArea.prototype.resize = function() {
	this.width = $(this.options.container).width() - this.margin.left - this.margin.right;
    this.height = $(this.options.container).height() - this.margin.top - this.margin.bottom;
    d3.select(this.options.container).select("svg").style('width', (this.width+this.margin.left+this.margin.right) + 'px').style('height', (this.height+this.margin.bottom+this.margin.top) + 'px');
    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], this.options.spacing);
    this.y = d3.scale.linear().range([this.height, 0]);
	this.prepareScales();
	if (this.options.showRuler) this.prepareAxes();
    this.itemUpdate();
    this.axesUpdate();
}

D3StackedArea.prototype.prepareScales = function() {
	var base = this;
	base.x.domain(base.dataset[0].values.map(function(d) { return d.x; }));
	console.log(base.color.range());
	base.categories = base.barStack(base.dataset);
	base.color.domain(base.dataset.map(function(item) { return item.key; }));
	base.y.domain(base.dataset.extent);
}

