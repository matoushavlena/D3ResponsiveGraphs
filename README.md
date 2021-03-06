[![Tweet Button](./.readme/tweet-button.png?2)](https://twitter.com/intent/tweet?text=%23D3ResponsiveGraphs%20A%20library%20of%20responsive,%20lightweight,%20and%20reusable%20graphs%20built%20with%20D3js.&url=https://github.com/matoushavlena/D3ResponsiveGraphs&via=matoushavlena)

#INFO
This repository is not maintaned any more. If you would like to maintain it, please let me know. I also have a newer version that removes the jQuery dependency.

#D3ResponsiveGraphs

A modular library of responsive, lightweight, and reusable graphs built with D3js and jQuery (in the next release, jQuery dependency is going to be eliminated). 

##Contents

- [Integration Examples](#integration-examples)
    - [Quick Start](#quick-start)
    - [Examples](#examples)
- [Similar Libraries](#similar-libraries)
- [Graphs](#graphs)
	- [Common Methods](#common-methods)
	- [Common Options](#common-options)
	- [Common Data Structure](#common-data-structure)
	- [D3StackedBar](#d3stackedbar)
		- [Usage](#usage)
		- [Specific Options](#specific-options)
	- [D3LineChart](#d3linechart)
	 	- [Usage](#usage-1)
		- [Specific Options](#specific-options-1)
	- [D3DonutChart](#d3donutchart)
	 	- [Usage](#usage-2)
		- [Specific Options](#specific-options-2)
- [Changelog](#changelog)

## Integration Examples

### Quick Start
Following is a quick example how to create stacked bar chart.

HTML:
```html
<div id="stackedbar"></div>
```
Javascript:
```js
var stackedbar = new D3StackedBar({ 
	container: "#stackedbar"
});
stackedbar.show();
```

### Examples
* [D3StackedBar example](http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-stackedbar.html)
* [D3LineChart example](http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-linechart.html)
* [D3DonutChart example](http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-donutchart.html)
* [D3PieChart example](http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-piechart.html)

## Similar Libraries
I'm currently working on this section. Stay tuned pls.

## Graphs
### Common Methods
* `show()` - renders chart into an appropriate HTML container set up in `container` property in options
* `update()` - updates chart, usually called when the data you want to display has changed. To manipulate data in a graph, use `dataset` property of the graph (for example `stackedbar.dataset = { ... }; stackedbar.update();`)
* `resize()` - resizes chart to fit it's container, called automatically on window resize if `resizable` option is set to true

### Common Options

Example of default options:
```javascript
{
	container: "#chart",
	margin: {top: 20, left: 50, bottom: 50, right: 20},
	spacing: 0.5,
	dataUrl: null,
	data: [ 
	        { key: "category 1", values: [ { x: "FY2008", y: 10 }, { x: "FY2009", y: 20 }, { x: "FY2010", y: 30 }, { x: "FY2011", y: 5 }, { x: "FY2012", y: 15 } ]}, 
	        { key: "category 2", values: [ { x: "FY2008", y: 20 }, { x: "FY2009", y: -40 }, { x: "FY2010", y: 20 }, { x: "FY2011", y: 5 }, { x: "FY2012", y: 10 } ]}, 
	        { key: "category 3", values: [ { x: "FY2008", y: -10 }, { x: "FY2009", y: 10 }, { x: "FY2010", y: 10 }, { x: "FY2011", y: -10 }, { x: "FY2012", y: 10 } ]}, 
	      ],
	resizable: true,
	showLegend: true,
	showTooltip: true,
	showRuler: true,
	showHorizontalGrid: true,
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
	tooltipText: function(d, element) { return "<p>Tooltip<br />x: "+d.x+"<br />y:"+d.y+"<p>"; }
}		
```
More detailed explanation:

* `container` (String) - identification of a DOM element that should be used as a container for rendering
* `margin` (Object) - margins in pixels around the graph, useful when we need to set up some space for axes' ticks
* `dataUrl` (String) - url of a data service from where we want to get data, using AJAX GET. If the value is null, we render data stored in a `data` property (below)
* `data` (Object) - data object used to render, it must have a specifi format described [above](#12-data-structure)
* `resizable` (boolean) - if set to true, resize() method is gonna be called everytime $(window).on('resize') event is triggered
* `showLegend` (boolean) - if set to true, legend is going to be displayed
* `showTooltip` (boolean) - if set to true, on mouse over tooltip is going to be displayed
* `showRuler` (boolean) - if set to true, x and y axes are going to be displayed together with ruler
* `showHorizontalGrid` (boolean) - if set to true, horizontal grid is going to be displayed
* `displayTable` (boolean) - if set to true, the graph could be converted to a table view
* `yFormat` (function) - function that can modify/format y values
* `colors` (Array) - array of colors that are used as background colors for bars (in the given order), can be represented by RGBA or HEX
* `xTickSize` (function) - size of the ticks on x axis (ruler)
* `yTickSize` (function) - size of the ticks on y axis (ruler)
* `xTicks` (Integer) - number of ticks to show on x axis (number of tickes doesn't have to correspond exactly because D3js takes this number only as a recommendation)
* `yTicks`: number of ticks to show on y axis (number of tickes doesn't have to correspond exactly because D3js takes this number only as a recommendation)
* `xTickPadding` (Integer) - padding between text and ticks on the x ruler
* `yTickPadding` (Integer) - padding between text and ticks on the y ruler
* `yAxisTranslate` (function) - position of y axis
* `xAxisTranslate` (function) - position of x axis
* `xTickFormat` (function) - function that can modify/format x values on the x axis
* `yTickFormat` (function) - function that can modify/format y values on the y axis
* `tooltipText` (function) - function that returns String value which is being displayed as a tooltip text
* `tooltipOnMouseEnter` (function) - function called when onmouseover event is triggered for a bar, in default this function displays a tooltip
* `tooltipOnMouseOut` (function) - function called when onmouseout event is triggered for a bar, in default this function hides a tooltip

### Common Data Structure
Data can be obtained from AJAX GET request (if `dataUrl` property is used) or can be directly assigned to a `data` property. Data has to have the following format with all the `values` arrays having the same length:
```js
[ 
        { key: "category 1", values: [{ x: 2013, y: -10 }, { x: 2014, y: 10 } ]}, 
        { key: "category 2", values: [{ x: 2013, y: -30 }, { x: 2014, y: 10 } ]},  
        { key: "category 3", values: [{ x: 2013, y: 30 }, { x: 2014, y: 30 } ]}
]
```

### D3StackedBar
D3js stacked bar chart with a support of negative values, responsive design, legends, tooltips, transitions, and ability to show data in a table view. Example is available here: http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-stackedbar.html

![alt D3StackedBar](https://raw.github.com/matoushavlena/D3ResponsiveGraphs/master/screenshots/d3.stackedbar.png)

#### Usage
HTML:
```html
<div id="stackedbar"></div>
```
Javascript:
```js
var stackedbar = new D3StackedBar({ 
	container: "#stackedbar"
});
stackedbar.show();
```

#### Specific Options
* `spacing` (Float) - spacing between bars
* `verticalText` (String) - text describing the y units, if set to null, nothing is displayed
* `tooltipOnMouseEnter` (function) - function called when onmouseover event is triggered for a bar, in default this function displays a tooltip
* `tooltipOnMouseOut` (function) - function called when onmouseout event is triggered for a bar, in default this function hides a tooltip

### D3LineChart
D3js line chart with a support of negative values, responsive design, legends, tooltips, transitions, and ability to show data in a table view. Example is available here: http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-linechart.html

![alt D3LineChart](https://raw.github.com/matoushavlena/D3ResponsiveGraphs/master/screenshots/d3.linechart.png)

#### Usage
HTML:
```html
<div id="linechart"></div>
```
Javascript:
```js
var linechart = new D3LineChart({ 
	container: "#linechart"
});
linechart.show();
```

#### Specific Options
* `spacing` (float) - left and right horizontal spacing
* `verticalText` (String) - text describing the y units, if set to null, nothing is displayed
* `interpolate` (String) - type of line interpolation (see [SVG documentation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate))
* `tooltipOnMouseEnter` (function) - function called when onmouseover event is triggered for a bar, in default this function displays a tooltip
* `tooltipOnMouseOut` (function) - function called when onmouseout event is triggered for a bar, in default this function hides a tooltip

### D3DonutChart
D3js donut chart with a support of responsive design, legends, tooltips, transitions, and ability to show data in a table view. Example is available here: http://rawgit.com/matoushavlena/D3ResponsiveGraphs/master/demo-donutchart.html

![alt D3DonutChart](https://raw.github.com/matoushavlena/D3ResponsiveGraphs/master/screenshots/d3.donutchart.png)

#### Usage
HTML:
```html
<div id="donutchart"></div>
```
Javascript:
```js
var donutchart = new D3DonutChart({ 
	container: "#donutchart"
});
donutchart.show();
```

#### Specific Options
* `spacing` (float) - left and right horizontal spacing
* `data` (Object) - data needs to be in following format: `[ { key: "category 1", value: 55 }, { key: "category 2", value: 25 } ]`
* `innerRatio` (Float) - ratio of the inner circle
* `outerRatio` (Float) - ratio of the outer circle
* `showInnerCircle` (boolean) - indicates whether inner circle should be rendered as an SVG elemenet (usually set to true if you want to style the center circle your donut)
* `textCenter` (function(data)) - text to display inside the inner circle
* `textCenterDY` (String) - can be used to manipulate vertical position of the text inside the inner circle (default value: "0.5rem")
* `textPercentage` (function(d)) - text to display on each part of the donut (default function display percentage representation of the particular part together with the original value)
* `tooltipOnMouseEnter` (function) - function called when onmouseover event is triggered for a bar, in default this function displays a tooltip
* `tooltipOnMouseOut` (function) - function called when onmouseout event is triggered for a bar, in default this function hides a tooltip

## Changelog
### Version 0.2
* Added D3DonutChart
* Added D3PieChart
* Fixed bugs, improved performance

### Version 0.1
* Added D3LineChart
* Now modular approach (all the charts inherit default behaviour from D3Core module)
* Code improvement

### Version 0.0
* Added D3StackedBar
