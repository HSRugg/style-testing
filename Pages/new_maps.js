var inds_color = d3.scaleOrdinal(d3.schemeCategory20);
console.log(d3.schemeCategory20);
//
//document.getElementById('my_p').innerHTML = "Displaying  "+industry+" Data From 2012"

var svg = d3.select("#plot_container").append("svg");
    svg.attr("width","950")
    .attr("height","650")
    .style("margin-left","75");
//
//var play_button = document.createElement("BUTTON");
//    play_button.setAttribute("width","50");
//    play_button.setAttribute("height","20");

//play_btn = d3.select("body").append("BUTTON");
//play_btn.attr("height","650");
//play_btn.innerHTML = "PLAY";

var industry_map = d3.map();
var name_map = d3.map();
var industry_map_2010 = d3.map();

var path = d3.geoPath();

//var x = d3.scaleLinear()
//    .domain([1, 10])
//    .rangeRound([600, 860]);

var color = d3.scaleLog()
    .base(Math.E)
    .domain([Math.exp(0), Math.exp(10)])
    .range(["#BBDEFB", "darkblue"]);

 /* For the drop shadow filter... */
  var defs = svg.append("defs");

  var filter = defs.append("filter")
      .attr("id", "dropshadow")

  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 4)
      .attr("result", "blur");
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

///Census-Data-Explorer/data_for_US/
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "top_precent_industys_by_county_2012.csv", function(d) { industry_map.set(String(d.id), d.industry_name), name_map.set(d.id, d.county_name); } )
    .defer(d3.csv, "top_precent_industys_by_county_2010.csv", function(d) {
    industry_map_2010.set(String(d.id), d.industry_name); })
    .await(ready);
    
    function ready(error, us) {
      if (error) throw error;
           
//  missing_fliter(topojson.feature(us, us.objects.counties).features);
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", "county")
      .attr("fill", function(d) { return inds_color(industry_map_2010.get(String(d.id)))})
      .attr("d", path)
      .attr("filter", "url(#dropshadow)")
    .transition()
    .duration(1000)
    .attr("fill", function(d) { return inds_color(industry_map.get(String(d.id)))})
    .append("title")
      .text(function(d) { return name_map.get(String(d.id)) +" \n Biggest Industry: " + industry_map.get(d.id); })
    ;
    }

//var change_year = function () {
//    console.log("changeyear...")
//    svg.selectAll("path").transition()
//    .duration(1000)
//    .style("fill", function(d) { return inds_color(industry_map_2010.get(String(d.id))) });
//        
//}
//change_year();   
//  svg.append("path")
//      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//      .attr("class", "states")
//      .attr("d", path);
//        



//make_inds_map_with_counties("Construction")