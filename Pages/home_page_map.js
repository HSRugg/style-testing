var make_home_map = function (link_to) {
    console.log(link_to)
        

    var width = 1000;
    var height = 600;
    // D3 Projection
    var projection = d3.geoAlbersUsa()
                       .translate([width/2, height/2])    // translate to center of screen
                       .scale([1200]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                 .projection(projection);  // tell path generator to use albersUsa projection

    // Define linear scale for output
    var color = d3.scaleLinear()
                  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

    //Create SVG element and append map to the SVG
    var svg = d3.select("#main_frame")
                .append("svg")
                .attr("id", "home_page_map")
                .attr("margin", "auto")
                .attr("width", width + 700)
                .attr("height", height)
                .style("border-radius","14px")
                .style("box-shadow","10px 10px");

    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")   
                .attr("id", "tooltip")               
                .style("opacity", 0);

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
            // Load in my states data

    state_json = "https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json"
    d3.csv("/d3_testing/Pages/US_State_pop_00-09.csv", function(data) {
        // get max for scaler
        
        var max = d3.max(data, function(d) { return +d.incress_2001;} );

        // Load GeoJSON data and merge with states data
        d3.json(state_json, function(json) {
        
            // not realyy needed just for the color scale..
            // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {
            for (year of ['incress_2001',
               'incress_2002', 'incress_2003', 'incress_2004', 'incress_2005',
               'incress_2006', 'incress_2007', 'incress_2008', 'incress_2009']) {
                // Grab State Name
                var dataState = data[i].Place;
                // Grab data value 
                var dataValue = data[i][year];
                // console.log(dataValue);
                // Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++)  {
                    var jsonState = json.features[j].properties.name;
                    if (dataState == jsonState) {
                    // Copy the data value into the JSON
                    json.features[j].properties[year] = dataValue; 
                    // Stop looking through the JSON
                    break;
                    }
                }
            }
        }

            
            
            console.log(json.features);
            
            
            
    // Make colorScaler
    var colorScaler = d3.scaleLinear()
                            .domain([-.02,.04])
                            .range(["blue","black"]);
    
    var rect_width = 180;
    var rect_height = 60;
            
    var no_dc = json.features
    no_dc.splice(8, 1);
    no_dc.splice(50, 1);
            
    var bars = svg.selectAll("rect.state_names")
                        .data(no_dc)
                        .enter()
                            .append("rect")
                            .attr("width", rect_width)
                            .attr("height", rect_height-1)
                            .attr("y", function(d, i) { 
                                     if (i < 10) { return i * rect_height }
                                else if (i < 20) { return (i-10) * rect_height }
                                else if (i < 30) { return (i-20) * rect_height }
                                else if (i < 40) { return (i-30) * rect_height }
                                else { return (i-40) * rect_height }
                            })
                            .attr("x", function(d, i) { 
                                     if (i < 10) { return 0 } 
                                else if (i < 20) { return rect_width*1 }
                                else if (i < 30) { return rect_width*2 }
                                else if (i < 40) { return rect_width*3 }
                                else {return rect_width*4}
                            })
                            .attr("fill", function(d) { return colorScaler(d.properties.incress_2001); })
                            .on("mouseover", function (d) {d3.select(this).style("fill", "blue"), document.getElementById(d.properties.name).style.fill = "blue";})
                            .on("mouseout", function (d) {d3.select(this).style("fill", function(d) { return        colorScaler(d.properties.incress_2001)}),
                                document.getElementById(d.properties.name).style.fill =  colorScaler(d.properties.incress_2001) })
                            .on('click', function(d) {if (link_to == "industry") {make_inds_lines(d.properties.name), make_inds_bars(d.properties.name)} else if (link_to == "gender") {make_line_for_state(d.properties.name), make_pie_for_state(d.properties.name)} });

            var extra_bars = svg.selectAll("rect.extra")
                        .data(no_dc)
                        .enter()
                            .append("rect")
                            .attr("width", rect_width)
                            .attr("height", rect_height-1)
                            .attr("y", function(d, i) { 
                                     if (i < 10) { return i * rect_height }
                                else if (i < 20) { return (i-10) * rect_height }
                                else if (i < 30) { return (i-20) * rect_height }
                                else if (i < 40) { return (i-30) * rect_height }
                                else { return (i-40) * rect_height }
                            })
                            .attr("x", function(d, i) { 
                                     if (i < 10) { return rect_width * 5 } 
                                else if (i < 20) { return rect_width * 6 }
                                else if (i < 30) { return rect_width * 7 }
                                else if (i < 40) { return rect_width * 8 }
                                else {return rect_width * 9}
                            })
                            .attr("fill", function(d) { return colorScaler(d.properties.incress_2001); })
                            .on("mouseover", function (d) {d3.select(this).style("fill", "blue") ;})
                            .on("mouseout", function (d) {d3.select(this).style("fill", function(d) { return colorScaler(d.properties.incress_2001); });
});
         
            var texts = svg.selectAll("state_name_texts")
                            .data(no_dc)
                            .enter()
                            .append("text")
                            .style('text-anchor','start')
                            .attr('transform', function(d,i,j) { return 'translate(14,0)' });
            
            texts
              .attr("y", function(d, i) {
                   if (i < 10) { return (i * rect_height) + rect_height/2 }
                                else if (i < 20) { return ((i-10) * rect_height) + rect_height/2 }
                                else if (i < 30) { return ((i-20) * rect_height) + rect_height/2 }
                                else if (i < 40) { return ((i-30) * rect_height) + rect_height/2 }
                                else { return ((i-40) * rect_height) + rect_height/2 }
            })
            .attr("x", function(d, i) {
                   if (i < 10) { return 0 }
                                else if (i < 20) { return rect_width  }
                                else if (i < 30) { return rect_width * 2 }
                                else if (i < 40) { return rect_width * 3 }
                                else { return rect_width * 4 }
            })
              .attr("dx", -3)
              .attr("dy", ".35em")
                .attr("fill", "white")
              .text(function(d) { return d.properties.name; });

            
    // Bind the data to the SVG and create one path per GeoJSON feature
    var paths = svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("filter", "url(#dropshadow)")
        .attr("id", function(d) { return d.properties.name })
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) { return colorScaler(d.properties.incress_2001) })
        .on('click', function(d) {console.log(typeof link_to); if (link_to == "gender") {make_line_for_state(d.properties.name), make_pie_for_state(d.properties.name)} else if (link_to == "industry") {make_inds_lines(d.properties.name), make_inds_bars(d.properties.name)}})
//            , changeTitle(d.properties.name)
        .on("mouseover", function(d) {      
            div.transition()        
               .duration(200)      
               .style("opacity", .9);      
               div.text(d.properties.name)
               .style("left", (d3.event.pageX) + "px")     
               .style("top", (d3.event.pageY - 18) + "px");    
        })   
        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0)
        })
        .attr('transform', function(d,i,j) { return 'translate(750,0)' })
        ;


    svg.selectAll("path").transition()
        .duration(8000)
        .style("fill", function(d) { return colorScaler(d.properties.incress_2009) });


        });
    });
    
};


