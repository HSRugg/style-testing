var make_line_for_state = function(state) {
    d3.select("svg").remove();
    d3.select("#tooltip").remove();
    
     document.getElementById("heading").innerHTML = "Displying Data For "+state;
     main_center = document.createElement("center");
     document.body.appendChild(main_center);
     main_center.style.margin = "auto";
     main_center.style.width = "90%";
     main_center.style.height = "85%";

    
    var chart = document.createElement("div");
    chart.setAttribute("id","chart");
    chart.style.borderRadius = "14px";
    main_center.appendChild(chart);
    
    var svg = d3.select("#chart")
			.append("svg")
            .attr("id", "line_plot_one")
            .attr("margin", "auto")
			.attr("width", 1000)
			.attr("height", 700);
    
    document.getElementById("chart").style.boxShadow = "2px 15px 22px lightblue";
    
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
        
    
    var path_to_data = "./data_by_state/"+state+"_small_all_eds.csv"
    d3.csv(path_to_data, function(error, data) {
    if (error) throw error;
    console.log(state);



    var data = data.filter(function(d) { 
        if(d["industry"]=="00")
        { return d; } 
    })
    
    // clean data types
    data.forEach(function(d) {
        d.Emp = +d.Emp;
        d.Average_pay = +d.Average_pay;
    })
    
    function filter_for_male(data) {
    return data.sex == "Male";
    };
    function filter_for_female(data) {
    return data.sex == "Female";
    };

    function filter_for_no_high(data) {
    return data.education == "Less Than High School";
    };
    function filter_for_high_school(data) {
    return data.education == "High School Graduate";
    };
    function filter_for_some_college(data) {
    return data.education == "Some College";
    };
    function filter_for_advanced(data) {
    return data.education == "Advanced Degree";
    };
    function filter_for_unknown(data) {
    return data.education == "Unavalble";
    };
        
    var maxpay = d3.max(data, 
        function(d) { return +d.Average_pay;} );

    var vis = d3.select("#line_plot_one"),
        WIDTH = 700,
        HEIGHT = 600,
        MARGINS = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 80
        },
        xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2004,2012]),
        yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,maxpay*1.2]),
        xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d")),
        yAxis = d3.axisLeft().scale(yScale);

    vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 25)
        .attr("x", 4)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");
    
    vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineGen = d3.line()
        .x(function(d) {
            return xScale(d.year)})
        .y(function(d) {
            return yScale(d.Average_pay)})
        .curve(d3.curveBasis);

    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_male).filter(filter_for_no_high)))
        .attr('class', 'Male')
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .style("stroke-dasharray", ("3, 3"))
        .attr("filter", "url(#dropshadow)");
    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_female).filter(filter_for_no_high)))
        .attr('class', 'Female')
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("data-legend", "No High School")
        .attr("filter", "url(#dropshadow)");

    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_male).filter(filter_for_high_school)))
        .attr('class', 'Male')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .style("stroke-dasharray", ("3, 3"))
        .attr("filter", "url(#dropshadow)");
    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_female).filter(filter_for_high_school)))
        .attr('class', 'Female')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("data-legend", "High School")
        .attr("filter", "url(#dropshadow)");

    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_male).filter(filter_for_some_college)))
        .attr('class', 'Male')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .style("stroke-dasharray", ("3, 3"))
        .attr("filter", "url(#dropshadow)");
    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_female).filter(filter_for_some_college)))
        .attr('class', 'Female')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("data-legend", "Some College")
        .attr("filter", "url(#dropshadow)");

    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_male).filter(filter_for_advanced)))
        .attr('class', 'Male')
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .style("stroke-dasharray", ("3, 3"))
        .attr("filter", "url(#dropshadow)");
    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_female).filter(filter_for_advanced)))
        .attr('class', 'Female')
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("data-legend", "Advanced Degree")
        .attr("filter", "url(#dropshadow)");

    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_male).filter(filter_for_unknown)))
        .attr('class', 'Male')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .style("stroke-dasharray", ("3, 3"))
        .attr("filter", "url(#dropshadow)");
    vis.append('svg:path')
        .attr('d', lineGen(data.filter(filter_for_female).filter(filter_for_unknown)))
        .attr('class', 'Female')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("data-legend", "Unavailable")
        .attr("filter", "url(#dropshadow)");

    var legenedX = 450;
    // add legend
//    var legend = vis.append("g")
//        .attr("class","legend")
//        .attr("transform","translate("+legenedX+",20)")
//        .style("font-size","12px")
//        .call(d3.legend);
      
   var legened_one = vis.append("rect") 
      .attr("width","185px")
      .attr("height","72px")
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr("opacity", .9)
      .attr("x", legenedX-85)
      .attr("y", 4)
      .attr("filter", "url(#dropshadow)");

var ed_list = ["Less Than High School","High School Graduate","Some College","Advanced Degree","Unavalble"];
    
var color_scale = d3.scaleOrdinal()
        .domain(["Less Than High School", "High School Graduate", "Some College", "Advanced Degree", "Unavalble"])
        .range(["green", "blue", "red", "orange", "black"]);

for (i = 0; i < ed_list.length; i++) { 
    vis.append("line")
      .attr("x1", legenedX+ 80)
      .attr("x2", legenedX+ 95)
      .attr("y1", 15+i*12)
      .attr("y2", 15+i*12)
      .attr('stroke-width', 2)
      .attr("stroke", function () { return (color_scale(ed_list[i])); });
    
    vis.append("text")
      .attr("x", legenedX+70)
      .attr("y", 15+i*12)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function () { return ed_list[i]; });
    
   }     
        //Legend Male - Female
    var legend_two = vis.append("rect")
      .attr("width","100px")
      .attr("height","72px")
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr("opacity", .9)
      .attr("x", legenedX + 120)
      .attr("y", 4)
      .attr("filter", "url(#dropshadow)")
        
    var line_types = [(3,3),(3,0)]
  
    vis.append("line")
      .attr("x1", legenedX+ 190)
      .attr("x2", legenedX+ 205)
      .attr("y1", 25)
      .attr("y2", 25)
      .style("stroke-dasharray", (3,3))
      .attr('stroke-width', 2)
      .style("stroke", 'black');  
    vis.append("line")
      .attr("x1", legenedX+190)
      .attr("x2", legenedX+205)
      .attr("y1", 50)
      .attr("y2", 50)
      .style("stroke-dasharray", (3,0))
      .attr('stroke-width', 2)
      .style("stroke", 'black');
    vis.append("text")
      .attr("x", legenedX+180)
      .attr("y", 25)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Male");
    vis.append("text")
      .attr("x", legenedX+180)
      .attr("y", 50)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Female");
    

    // y axis lable 
    vis.append("text")      // text label for the x axis
        .attr("x", 70 )
        .attr("y", 12 )
        .style("text-anchor", "middle")
        .text("Yearly Wage");
        
     vis.append("text")      // text label for the x axis
        .attr("x", 70 )
        .attr("y", -10 )
        .style("text-anchor", "middle")
        .text("Average");
        
        
        

})};
