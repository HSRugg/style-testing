
var make_inds_bars = function(state) {
    
     var plot_two = document.createElement('div');
        plot_two.id = "plot_two";
        plot_two.setAttribute("class", "chart_holder");
        plot_two.style.position = "relative";
        plot_two.style.cssFloat = "left";
        line_plot.style.padding = 0;
        plot_two.style.paddingLeft = 40;
        plot_two.style.marginLeft = 40;
//        plot_two.style.marginBottom = 10;
        plot_two.style.width = 600;
        plot_two.style.boxShadow = "2px 15px 22px lightblue";
        plot_two.style.borderRadius = "14px";
    document.body.appendChild(plot_two);
    
    var rank_heading = document.createElement("h2");
        rank_heading.innerHTML = "RANKED BY PEOPLE EMPLYED 2004"
        rank_heading.innerHTML = rank_heading.innerHTML.split('').join('<br>');
        rank_heading.style.position = "relative";
        rank_heading.style.cssFloat = "right";
        rank_heading.style.fontFamily = "monospace";
        rank_heading.style.paddingRight = "48px";
        rank_heading.style.paddingTop = "10px"; 
    
    plot_two.appendChild(rank_heading);
//    d3.select("svg").remove();
    
    
    // Append Div for tooltip
    var div = d3.select("body")
                .append("div")   
                .attr("id", "tooltip")               
                .style("opacity", 0)
                ;
    
    var path_to_data = "./Pages/industry_data.csv";
    d3.csv(path_to_data, function(data) {
        console.log(data[0])
         // color scale
    var colorScale = d3.scaleOrdinal()
        .domain(['Agriculture, Forestry, Fishing and Hunting',
    'Mining, Quarrying, and Oil and Gas Extraction', 'Utilities',
    'Construction', 'Manufacturing', 'Wholesale Trade', 'Retail Trade',
    'Transportation and Warehousing', 'Information',
    'Finance and Insurance', 'Real Estate and Rental and Leasing',
    'Professional, Scientific, and Technical Services',
    'Management of Companies and Enterprises',
    'Administrative, Support, Waste Management, and Remediation Services',
    'Educational Services', 'Health Care and Social Assistance',
    'Arts, Entertainment, and Recreation',
    'Accommodation and Food Services',
    'Other Services (except Public Administration)',
    'Public Administration'])
    .range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a",
                "#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94",
                "#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d",
                "#17becf", "#9edae5"]);  
        
        
     
        
        var year = "2004";
        var data = data.filter(function(d) { 
            if( d["state"] == state && d["year"]==year && d["industry"]!="00" && d["industry"]!="000" && d["industry"]!="0000")
            { return d; } 
                })
        data.forEach(function(d) {
            d.Emp = +d.Emp;
            d.Payroll = +d.Payroll;
            d.avrage_pay = +d.avrage_pay;
        });
               
                                              
        data = data.sort(function (a,b) {return d3.descending(a.Emp, b.Emp); });

        var max = d3.max(data, function(d) { return +d.avrage_pay;} );   

        var width = 500;
        var height = 675;
        var widthScaler = d3.scaleLinear()
                        .domain([0,max])
                        .range([0,width]);


        var canvas = d3.select("#plot_two")
                        .append("svg")
                        .attr("id", "industry_svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("padding", "30px 0px 0px 0px");
        
          var defs = canvas.append("defs");

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
        
        var spacing = 32;
        
        
        //  set up bar clcik function that displys pie charts
        var bar_click = function (industry, emp_selected) {
            var emp_selected = emp_selected;
            console.log(industry, emp_selected, "this is input");
            
            //   move bars 
            bars.transition()
            .duration(1500)
            .attr("y", function(d) {if (d.industry != industry) {return -60} else {return 0} } )
            .attr("opacity", function(d) {if (d.industry != industry) {return 0} else {return 1} } )
            texts.transition()
            .duration(1500)
            .attr("y", function(d) {if (d.industry != industry) {return -80} else {return 15}}  )
            ;
            
            //  reset clcick to move bars back and remove pie
            bars.on('click', function(d) {
                
            bars.transition()
                .duration(0)
                .attr("opacity", 1)
                
            texts.transition()
                .duration(0)
                .attr("opacity", 1)
                
            bars.transition()
                .duration(1500)
                .attr("y", function(d, i) { return i * spacing})
                
            texts.transition()
                .duration(1500)
                .attr("y", function(d, i) { return i * spacing+spacing/2})
            
            bars.on('click', function(d) {bar_click(d.industry, d.Emp)});
                
            d3.selectAll(".arc")
                .remove()
            
            });
            
        //   make a pie chart to show percents of sub industrys    
            d3.csv('./data_by_state/subsectors_by_state/'+state+'subsector_data.csv', function(data) {
            
            data = data.filter(function(d) { 
            if( d["year"]==year && d["industry_sector"]==industry)
            { return d; } });    
                
                // clean data types
            data.forEach(function(d) {
                d.Emp = +d.Emp;
            }) 
                
            data = data.sort(function (a,b) {return d3.descending(a.Emp, b.Emp); });
            
            subsector_list = data.filter(function(d){ return d.industry; });
                
         
            // color range
            var color = d3.scaleOrdinal()
                .range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a",
                        "#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94",
                        "#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d",
                        "#17becf", "#9edae5"])
                .domain([subsector_list.industry]);


            var arc = d3.arc()
                .outerRadius(180)
                .innerRadius(0);


//            // arc for the labels position
//            var labelArc1 = d3.arc()
//                .outerRadius(radius - 120)
//                .innerRadius(radius - 120);

            // generate pie chart and donut chart
            var pie = d3.pie()
                .value(function(d) { return d.Emp; });

                
            // Helper function for animation of pie chart and donut chart
            function tweenPie(b) {
                  b.innerRadius = 0;
                  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                  return function(t) { return arc(i(t)); };
            }

        

          // "adding container used to group to exsiting svg "
          var g = d3.select(document.getElementById("industry_svg")).selectAll(".arc")
              .data(pie(data))
            .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + 520 / 2 + "," + 800 / 2 + ")");
          

          // append path 
          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.industry); })
              .on("mouseover", function(d) {      
                div.transition()        
                   .duration(200)      
                   .style("opacity", .9);      
                   div.text(d.data.industry)
                   .style("left", (d3.event.pageX) + "px")     
                   .style("top", (d3.event.pageY - 18) + "px");    
                })   
            // fade out tooltip on mouse out               
            .on("mouseout", function(d) {       
                div.transition()        
                   .duration(500)      
                   .style("opacity", 0)
                })
            .transition()
              .duration(2000)
              .attrTween("d", tweenPie);
           
                
        //     SUBSECTOR RECTS/LABES
        spacing = 30;     
        g.selectAll("rect")
                    .data(data.slice(0, 5))
                    .enter()
                        .append("rect")
                        .attr("width", 475)
                        .attr("height", spacing-6)
                        .attr("y", function(d, i) { return -360 + i * spacing})
                        .attr("x", -235)
                        .attr("opacity", 0)
                        .attr("fill", function(d) { return color(d.industry); })
                        .transition()
                          .delay(1000).duration(600)
                          .attr("opacity", 1);
        
        var subsector_texts = g.selectAll("subsector_texts")
                                    .data(subsector_list.slice(0, 5))
                                    .enter()
                                    .append("text")
                                    .style('text-anchor','start')
                                    .attr('transform', function(d,i,j) { return 'translate(14,0)' })
                                    .attr("opacity", 0)
                                        .transition()
                                          .delay(1000).duration(600)
                                          .attr("opacity", 1);
                
        subsector_texts.attr("class", "value")
                      .attr("y", function(d, i) { return -362 + i * spacing+spacing/2})
                      .attr("x", -230)
                      .attr("dx", -6)
                      .attr("dy", ".35em")
                      .attr("text-anchor", "end")
                      .text(function(d) { return d.industry; });
                
        var subsector_percents = g.selectAll("subsector_percents")
                                    .data(subsector_list.slice(0, 5))
                                    .enter()
                                    .append("text")
                                    .style('text-anchor','start')
                                    .attr('transform', function(d,i,j) { return 'translate(14,0)' })
                                    .attr("opacity", 0)
                                        .transition()
                                          .delay(1000).duration(600)
                                          .attr("opacity", 1);
                
        subsector_percents.attr("class", "percents")
                  .attr("y", function(d, i) { return -362 + i * spacing+spacing/2})
                  .attr("x", 190)
                  .attr("dx", -6)
                  .attr("dy", ".35em")
                  .attr("text-anchor", "end")
                  .text(function(d) { console.log(d.Emp, emp_selected); return Math.round((d.Emp/emp_selected)*100)+"%" });
                
            });
            
        };
        
        var bars = canvas.selectAll("rect")
                            .data(data)
                            .enter()
                                .append("rect")
                                .attr("filter", "url(#dropshadow)")
                                .attr("width", 0)
                                .attr("height", spacing-6)
                                .attr("y", function(d, i) { return i * spacing})
                                .attr("fill", "white")
                                .on("mouseover", function (d) {d3.selectAll("#"+d.industry.split(' ').join('').split(',').join('').replace("(", "").replace(")","")).style("stroke-width", "5");})
                                .on("mouseout", function (d) {d3.selectAll("#"+d.industry.split(' ').join('').split(',').join('').replace("(", "").replace(")","")).style("stroke-width", "1"); })
                                .on('click', function(d) {bar_click(d.industry, d.Emp);});
                                                             

        var texts = canvas.selectAll("mytexts")
                        .data(data)
                        .enter()
                        .append("text")
                        .style('text-anchor','start')
                        .attr('transform', function(d,i,j) { return 'translate(14,0)' });
        texts.attr("class", "value")
                      .attr("y", function(d, i) { return i * spacing+spacing/2})
                      .attr("dx", -6)
                      .attr("dy", ".35em")
                      .attr("text-anchor", "end")
                      .text(function(d) { return d.industry; });


        bars.transition()
            .duration(1500)
            .attr("width", function(d) { return 550; })
            .attr("fill", function(d) {return colorScale(d.industry)});
            
        
        }        
    )};