/*
 * D3ResponsiveGraphs - D3StackedBar
 * Author: Matous Havlena (matous@havlena.net)
 * www.havlena.net/en
 * @matoushavlena
 */

function D3StackedBar(options) {
	if (!(this instanceof D3StackedBar)) throw new TypeError("D3StackedBar constructor cannot be called as a function.");
    var defaultOptions = {
		container: "#stackedbar",
		margin: {top: 20, left: 50, bottom: 50, right: 20},
		barSpacing: 0.2,
		dataUrl: null,
		data: [ 
		        { key: "category 1", values: [{ x: 2013, y: -10 }, { x: 2014, y: 10 } ]}, 
		        { key: "category 2", values: [{ x: 2013, y: -30 }, { x: 2014, y: 10 } ]},  
		        { key: "category 3", values: [{ x: 2013, y: 30 }, { x: 2014, y: 30 } ]}
		      ],
		resizable: true,
		showLegend: true,
		showTooltip: true,
		showRuler: true,
		showHorizontalGrid: true,
		verticalText: null,
		displayTable: true,
		yFormat: function(d) { return d; },
		colors: ['rgb(228,26,28)','rgb(55,126,184)','rgb(77,175,74)','rgb(152,78,163)','rgb(255,127,0)','rgb(255,255,51)','rgb(166,86,40)','rgb(247,129,191)','rgb(153,153,153)'],
   		xTickSize: function(base) { return 10; },
		yTickSize: function(base) { return 10; },
		xTicks: 5,
		yTicks: 5,
		xTickPadding: 5,
		yTickPadding: 5,
		yAxisTranslate: function(base) { return "translate(0,0)"; },
		xAxisTranslate: function(base) { return "translate(0,"+base.height+")"; },
		xTickFormat: function(d) { return d; },
		yTickFormat: function(d) { return d; },
		tooltipText: function(d, element) { return "<p>Tooltip<br />x: "+d.x+"<br />y:"+d.y+"<p>"; },
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
}

D3StackedBar.prototype = {
	
	constructor: D3StackedBar,

    show: function() {
    	var base = this;
    	base.prepare();
    	base.start();
    	var timeOut = null;
    	if (this.options.resizable) {
	    	$(window).on('resize', function(){	
	    	    if (timeOut != null) clearTimeout(timeOut);
	    	    timeOut = setTimeout(function(){
	    	    	base.resize()
	    	    }, 500);
	    	});
    	}
    },

    prepare: function() {
    	var base = this;
    	this.margin = this.options.margin;
        this.width = $(this.options.container).width() - this.margin.left - this.margin.right;
        this.height = $(this.options.container).height() - this.margin.top - this.margin.bottom;
        this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], this.options.barSpacing);
        this.y = d3.scale.linear().range([this.height, 0]);
        this.color = d3.scale.ordinal().range(this.options.colors);
        this.noData = null;
        
        if (this.options.showRuler) this.prepareAxes();
        
        this.barStack = function(data) {
            var i = base.x.domain().length;
            while (i--) {
                var posBase = 0, negBase = 0;
                data.forEach(function(category) {
                    var item = category.values[i]
                    item.size = Math.abs(item.y);
                    if (item.y < 0) {
                        item.y0 = negBase;
                        negBase -= item.size;
                    } else {
                        posBase += item.size;
                        item.y0 = posBase;
                    }
                });
            }
            data.extent = d3.extent(d3.merge(d3.merge(data.map(function(category) {
                return category.values.map(function(item) {
                    return [item.y0, item.y0 - item.size]
                })
            }))));
            return data;
        }
        
        if (this.options.showTooltip) {
        	$(this.options.container).append("<div class='tooltip' style='display: none;' />");
        	this.tooltipWidth = $(this.options.container+" .tooltip").outerWidth();
        }
        
        if (this.options.showLegend) {
        	base.legendDiv = d3.select(base.options.container).append("div").attr("class", "legend").append("ul");
        }
        
        this.svg = d3.select(this.options.container)
					.append("svg:svg")
					.attr("width", this.width+this.margin.left+this.margin.right)
					.attr("height", this.height+this.margin.top+this.margin.bottom)
					.append("svg:g").attr("transform", "translate("+this.margin.left+","+this.margin.top+")");
        
        if (this.options.displayTable) {
        	$(this.options.container).append("<div class='table' style='display: none;'><table /></div>");
        	$(this.options.container).append("<a href='#' class='showTableIcon'>Display in Table</a>");
        	this.table = $(this.options.container+" .table table");
        	this.table.parent().css({
        		width: $(this.options.container+" svg").width(),
        		height: $(this.options.container+" svg").height()
        	});
        	
        	$(this.options.container+" .showTableIcon").on("click", function(e) {
        		e.preventDefault();
        		if ($(this).hasClass("selected")) {
        			$(this).removeClass("selected");
        			$(this).text("Display in Table");
        			base.table.parent().fadeOut("slow");
        		} else {
        			$(this).addClass("selected");
        			$(this).text("Display in Graph");
        			base.table.parent().fadeIn("slow");
        		}
        	});	
        }
    },
    
    start: function() {
    	var base = this;
    	if (base.dataset) base.render();
    	else if (this.options.dataUrl!=null) {
            $.ajax({
				url : base.options.dataUrl,
				type : 'GET'
			}).done(function(data){
				base.dataset = data;
				base.render();
    		});
    	} else {
    		base.dataset = base.options.data;
    		base.render();
    	}   
	},
	
	render: function() {
    	var base = this;
    	
    	if (base.dataset.length==0) {
    		this.noData = true;
    		base.showNoData();
    		return;
    	} else this.noData = false;
    	
    	base.prepareScales();
    	
    	base.prepareCategory();
    	base.categoryEnter();

    	base.prepareRect();
    	base.rectEnter();
		
		if (base.options.showRuler) base.axesRender();
		if (base.options.showTooltip) base.tooltipRender();
		
		if (base.options.verticalText!=null) base.showVerticalText();
		
        if (base.options.showLegend) {
        	base.prepareLegend();
        	base.legendEnter();
        }
        
        if (base.options.displayTable) base.tableRender();
	},
	
	update: function() {
		var base = this;
		if (this.noData) {
			this.svg.selectAll(".nodata").remove();
			this.noData = false;
		}
		
		if (base.dataset.length==0) {
    		base.svg.selectAll(".rect").remove();
    		base.svg.selectAll(".category").remove();
    		base.showNoData();
    		base.noData = true;
    		return;
    	}
    	
		this.prepareScales();
		
    	this.prepareCategory();
    	this.categoryEnter();
    	this.categoryUpdate();
    	this.categoryExit();
    	
    	this.prepareRect();
    	this.rectEnter();
    	this.rectUpdate();
    	this.rectExit();
    	
    	this.axesUpdate();
    	this.tooltipRender();
    	
        if (base.options.showLegend) {
        	this.prepareLegend();
        	this.legendEnter();
        	this.legendUpdate();
        	this.legendExit();
        }
        
        if (base.options.displayTable) base.tableRender();
	},
	
	resize: function() {
		this.width = $(this.options.container).width() - this.margin.left - this.margin.right;
        this.height = $(this.options.container).height() - this.margin.top - this.margin.bottom;
        d3.select(this.options.container).select("svg").style('width', (this.width+this.margin.left+this.margin.right) + 'px').style('height', (this.height+this.margin.bottom+this.margin.top) + 'px');
        this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], this.options.barSpacing);
        this.y = d3.scale.linear().range([this.height, 0]);
		this.prepareScales();
		if (this.options.showRuler) this.prepareAxes();
        this.rectUpdate();
        this.axesUpdate();
	},
	
	prepareScales: function() {
		var base = this;
		base.x.domain(base.dataset[0].values.map(function(d) { return d.x; }));
		base.categories = base.barStack(base.dataset);
    	base.color.domain(base.dataset.map(function(item) { return item.key; }));
    	base.y.domain(base.dataset.extent);
	},
	
	prepareAxes: function() {
		var base = this;
        this.xAxis = d3.svg.axis().scale(this.x).ticks(this.options.xTicks).tickSize(this.options.xTickSize(base)).tickPadding(this.options.xTickPadding).tickFormat(this.options.xTickFormat).orient("bottom");
        this.yAxis = d3.svg.axis().scale(this.y).ticks(this.options.yTicks).tickSize(this.options.yTickSize(base)).tickPadding(this.options.yTickPadding).tickFormat(this.options.yTickFormat).orient("left");
	},
	
	axesRender: function() {
		var base = this;
		
		if (base.options.showHorizontalGrid) {
			base.horizontalGrid = base.svg.append("g")
				.attr("class", "grid vertical")
				.selectAll("line.horizontalGrid").data(base.y.ticks(base.options.yTicks))
			
			base.horizontalGrid.enter()
		    	.append("line")
		        .attr("class", "horizontalGrid")
		        .transition().duration(1000)
		        .attr("x1", 0)
		        .attr("x2", base.width)
		        .attr("y1", function(d){ return base.y(d); })
		        .attr("y2", function(d){ return base.y(d); });
		}
		
    	if (base.y.domain()[0]<0) {
			base.centerLine = base.svg.append("g")
				.attr("class", "centerLine");
			
			base.centerLine
		    	.append("line")
		        .transition().duration(1000)
		        .attr("x1", 0)
		        .attr("x2", base.width)
		        .attr("y1", function(d){ return base.y(0); })
		        .attr("y2", function(d){ return base.y(0); });
    	}
		
		base.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", base.options.xAxisTranslate(base))
			.call(base.xAxis);
	
		base.svg.append("g")	
			.attr("class", "y axis")
			.attr("transform", base.options.yAxisTranslate(base))
			.call(base.yAxis);
	},
	
	axesUpdate: function() {
		var base = this;
		
		if (base.options.showHorizontalGrid) {
			base.horizontalGrid = base.svg.select("g.grid.vertical").selectAll("line.horizontalGrid").data(base.y.ticks(base.options.yTicks));
			
			base.horizontalGrid.enter()
		    	.append("line")
		        .attr("class", "horizontalGrid")
		        .attr("y1", 0)
		        .attr("y2", 0)
		        .transition().duration(1000)
		        .attr("x1", 0)
		        .attr("x2", base.width)
		        .attr("y1", function(d){ return base.y(d); })
		        .attr("y2", function(d){ return base.y(d); });
			
			base.horizontalGrid
		        .transition().duration(1000)
		        .attr("x1", 0)
		        .attr("x2", base.width)
		        .attr("y1", function(d){ return base.y(d); })
		        .attr("y2", function(d){ return base.y(d); });
			
			base.horizontalGrid.exit()
		        .transition().duration(1000)
		        .attr("y1", 0)
		        .attr("y2", 0).remove();
		}
		base.centerLine = base.svg.select(".centerLine");
		if (base.y.domain()[0]<0) {
			if (!base.centerLine.select("line")) {
				base.centerLine
			    	.append("line")
			        .attr("y1", 0)
			        .attr("y2", 0)
			        .transition().duration(1000)
			        .attr("x1", 0)
			        .attr("x2", base.width)
			        .attr("y1", function(d){ return base.y(0); })
			        .attr("y2", function(d){ return base.y(0); });
			} else {
				base.centerLine.select("line")
			        .transition().duration(1000)
			        .attr("x1", 0)
			        .attr("x2", base.width)
			        .attr("y1", function(d){ return base.y(0); })
			        .attr("y2", function(d){ return base.y(0); });
			}
		} else if (base.centerLine) {
			base.centerLine.select("line")
		        .transition().duration(1000)
		        .attr("y1", 0)
		        .attr("y2", 0).remove();
		}
		
		base.svg.selectAll(".x.axis")
		   .transition().duration(1000)
		   .attr("transform", base.options.xAxisTranslate(base))
		   .call(base.xAxis.scale(base.x));
		
		base.svg.selectAll(".y.axis")
		   .transition().duration(1000)
		   .call(base.yAxis.scale(base.y));
	},
	
	prepareCategory: function() {
		this.category = this.svg.selectAll(".category")
			.data(this.categories);
	},
	
	categoryEnter: function() {
		var base = this;
		base.category
			.enter().append("g")
			.attr("class", "category")
			.attr("original-key", function(d, i) { return d.key; })
			.style("fill", function(d, i) { return base.color(d.key); });
	},
	
	categoryUpdate: function() {
		var base = this;
		base.category
			.attr("original-key", function(d, i) { return d.key; })
			.transition().duration(500).ease("cubic-in-out")
			.style("fill", function(d, i) { return base.color(d.key); });
	},
	
	categoryExit: function() {
		var base = this;
		base.category
			.exit().selectAll(".rect")
			.transition()
		    .remove();
		base.category
			.exit()
			.transition()
		    .remove();
	},
	
	prepareRect: function() {
		this.rect = this.category.selectAll("rect")
			.data(function(d) { return d.values; });
	},
	
	rectEnter: function() {
		var base = this;
		base.rect
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
	},
	
	rectUpdate: function() {
		var base = this;
		base.rect
			.attr("original-x", function(d) { return d.x; })
			.attr("original-y", function(d) { return d.y; })	
			.transition().duration(500).ease("cubic-in-out")
			.attr("x", function(d) { return base.x(d.x); })
			.attr("y", function(d) { return base.y(d.y0); })
			.attr("height", function(d) { return base.y(0)-base.y(d.size); })
			.attr("width", base.x.rangeBand());
	},
	
	rectExit: function() {
		var base = this;
		base.rect.exit()
		    .transition().duration(300).ease("cubic-in-out")
		    .attr("height", 0)
		    .attr("y", function(d) { return base.height; })  
		    .remove();
	},
	
	tooltipRender: function() {
		var base = this;
		base.rect.on("mouseover", function(d) { base.options.tooltipOnMouseOver(d, this, base); });
		base.rect.on("mouseout", function(d) { base.options.tooltipOnMouseOut(d, this, base); });
	},
	
	tableRender: function() {
		var base = this;
		base.table.empty();
		var $firstRow = $("<tr />");

		$firstRow.append("<th />");
		base.x.domain().forEach(function(element) {	
			var t = base.options.verticalText==null ? element : element+" ("+base.options.verticalText+")";
			$firstRow.append($("<th />").text(t));
		});
		base.table.append($("<thead />").append($firstRow));
		
		this.dataset.forEach(function(element) {
			var $row = $("<tr />");
			$row.append($("<th />").text(element.key));
			element.values.forEach(function(value) {
				$row.append($("<td />").text(base.options.yFormat(value.y)));
			});
			base.table.append($row);
		});
	},
	
	showNoData: function() {
		var base = this;
		base.svg.append("svg:text")
	  		.attr("dy", function(d) { return base.height/2; })
	  		.attr("dx", function(d) { return base.width/2; })
	  		.text("No data")
	  		.attr("text-anchor", "middle")
	  		.attr("class", "nodata")
		    .style("pointer-events", "none");
	},
	
	showVerticalText: function() {
		this.svg.append("text")
	    	.attr("transform", "rotate(-90)")
	    	.attr("y", 6)
	    	.attr("dy", ".71em")
	    	.style("text-anchor", "end")
	    	.text(this.options.verticalText);
	},
	
	prepareLegend: function() {
    	this.legend = this.legendDiv.selectAll('li').data(this.color.domain());
	},
	
	legendEnter: function() {
		var base = this;
    	base.legend.enter().append('li')
    		.style("opacity", 0)
      	    .style('border-color', function(d) { return base.color(d); })
      	    .text(function(d) { return d; }) 		
    		.transition().duration(500).ease("cubic-in-out")
      	    .style("opacity", 1)
	},
	
	legendUpdate: function() {
		var base = this;
	   	base.legend
	  	    .style('border-color', function(d, i) { return base.color(d); })
	  	    .text(function(d) { return d; });
	},
	
	legendExit: function() {
    	this.legend.exit()
    		.style("opacity", 1)
    		.transition().duration(500).ease("cubic-in-out")
      	    .style("opacity", 0)
    		.remove();
	}
	
};

