function D3PieChart(options) {
	if (!(this instanceof D3PieChart)) throw new TypeError("D3PieChart constructor cannot be called as a function.");
    var defaultOptions = {
		container: "#piechart",
		outerRatio: 0.8,
		showInnerCircle: false,
	}	
	if (typeof options == 'object') this.options = $.extend(defaultOptions, options);
	else this.options = defaultOptions;
    D3DonutChart.call(this, this.options);
}

inheritPrototype(D3PieChart, D3DonutChart);

D3PieChart.prototype.prepare = function() {
	D3Core.prototype.prepare.apply(this);
	this.radius = Math.min(this.width, this.height) / 2;
    this.formats = { percent: d3.format('#'), integer: d3.format('f') };
    
    this.arc = d3.svg.arc()
		.innerRadius(0)
		.outerRadius(this.radius*this.options.outerRatio);
	
	this.pie = d3.layout.pie().sort(null)
		.value(function(d) {
			return d.value;
		});
	
	this.svg.attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");
}
/*

D3PieChart.prototype.prepare = function() {
	D3Core.prototype.prepare.apply(this);
	this.radius = Math.min(this.width, this.height) / 2;
    this.formats = { percent: d3.format('#'), integer: d3.format('f') };
    
    this.arc = d3.svg.arc()
		.innerRadius(0)
		.outerRadius(this.radius*this.options.outerRatio);
	
	this.pie = d3.layout.pie().sort(null)
		.value(function(d) {
			return d.value;
		});
	
	this.svg.attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");
}
*/

