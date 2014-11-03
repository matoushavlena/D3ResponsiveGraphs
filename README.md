#D3ResponsiveGraphs

A library of responsive graphs build with D3js and jQuery. 

##1. D3StackedBar
![alt D3StackedBar](https://raw.github.com/matoushavlena/D3ResponsiveGraphs/master/screenshots/d3.stackedbar.png)

###1.1 Usage
==================
HTML:
```html
<div id="#stackedbar"></div>
```
Javascript:
```javascript
var stackedbar = new D3StackedBar({ 
	container: "#stackedbar"
});
stackedbar.show();
```
###1.1 Methods
* `show()` - renders stackedbar into appropriate HTML container set up in `container` property in options
* `update()` - updates stackedbar, usually called when the data you want to display has changed
* `resize()` - resizes stackedbar to fit it's container, called automatically on window resize if `resizable` option is set to true

### 1.2 Options
Example of default options:
```javascript
{
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
	colors: ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)','rgb(255,255,153)','rgb(177,89,40)'],
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
	tooltipOnMouseEnter: function(d, element, base) { 		    
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
```
More detailed explanation:
* `container` - description of a DOM element that should be used as a container for rendering
* `margin` - margins in pixels around the graph, useful when we need to set up some space for axes' ticks
* `barSpacing` - spacing between bars
* `dataUrl` - url of a data service from where we want to get data, using AJAX GET. If the value is null, we render data stored in a `data` property (below)
* `data` - data object used to render, it must have the following format:
```
[ 
        { key: "category 1", values: [{ x: 2013, y: -10 }, { x: 2014, y: 10 } ]}, 
        { key: "category 2", values: [{ x: 2013, y: -30 }, { x: 2014, y: 10 } ]},  
        { key: "category 3", values: [{ x: 2013, y: 30 }, { x: 2014, y: 30 } ]}
]
```
