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
		barSpacing: 0.2,
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

inheritPrototype(D3StackedBar, D3Core);

D3StackedBar.prototype.prepareItem = function() {
	this.item = this.category.selectAll("rect")
		.data(function(d) { return d.values; });
}

D3StackedBar.prototype.itemEnter = function() {
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

D3StackedBar.prototype.itemUpdate = function() {
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

D3StackedBar.prototype.itemExit = function() {
	var base = this;
	base.item.exit()
	    .transition().duration(300).ease("cubic-in-out")
	    .attr("height", 0)
	    .attr("y", function(d) { return base.height; })  
	    .remove();
}

D3StackedBar.prototype.tooltipRender = function() {
	var base = this;
	base.item.on("mouseover", function(d) { base.options.tooltipOnMouseOver(d, this, base); });
	base.item.on("mouseout", function(d) { base.options.tooltipOnMouseOut(d, this, base); });
}

D3StackedBar.prototype.showVerticalText = function() {
	this.svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(this.options.verticalText);
}

D3StackedBar.prototype.render = function() {
	D3Core.prototype.render.apply(this);
	if (this.options.verticalText!=null) this.showVerticalText();
}

D3StackedBar.prototype.prepare = function() {
	D3Core.prototype.prepare.apply(this);
	var base = this;
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
    };
    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], this.options.barSpacing);
}

D3StackedBar.prototype.prepareScales = function() {
	var base = this;
	base.x.domain(base.dataset[0].values.map(function(d) { return d.x; }));
	console.log(base.color.range());
	base.categories = base.barStack(base.dataset);
	base.color.domain(base.dataset.map(function(item) { return item.key; }));
	base.y.domain(base.dataset.extent);
}

