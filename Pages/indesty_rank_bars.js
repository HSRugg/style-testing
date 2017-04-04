
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
        function filter_for_some_college(data) {
        return data.education == "Some College";
        };
        function filter_for_advanced(data) {
        return data.education == "Advanced Degree";
        };
        function filter_for_unknown(data) {
        return data.education == "Unavalble";
        };
                              
                                              
        data = data.sort(function (a,b) {return d3.descending(a.Emp, b.Emp); });

        var max = d3.max(data, function(d) { return +d.avrage_pay;} );   

        var width = 500;
        var height = 675;
        var widthScaler = d3.scaleLinear()
                        .domain([0,max])
                        .range([0,width]);


        var canvas = d3.select("#plot_two")
                        .append("svg")
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
                                .on("mouseout", function (d) {d3.selectAll("#"+d.industry.split(' ').join('').split(',').join('').replace("(", "").replace(")","")).style("stroke-width", "1"); });
                                                             

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