var path_to_folder = "/d3_testing/data_by_state/"
console.log('im here two')
var make_pie_for_state = function(state) {
    
    var pie_container = document.createElement("div");
    pie_container.setAttribute("id","pie_container");
    pie_container.style.height = "700px";
    pie_container.style.width = "700px";
    pie_container.style.marginTop = "0px";
    pie_container.style.borderRadius = "14px";
    
    var my_pie1 = document.createElement("div");
    my_pie1.setAttribute("id","mypie1");
    my_pie1.style.marginTop = "70px";
    pie_container.appendChild(my_pie1);
    main_center.appendChild(pie_container);
    
    
        
    var year = "2012";
    
    var year_lable = document.createElement("div");
    year_lable.style.transform =  "translate(230px,-10px)";
    year_lable.style.height = 70;
    year_lable.style.width = 120;
    year_lable.style.borderStyle = "solid";
    year_lable.style.borderWidth = "2px";
    year_lable.style.backgroundColor = "white";
    year_lable.innerHTML = year;
    year_lable.style.fontSize = 38;
    year_lable.style.lineHeight = 1.8;
    year_lable.style.filter = "url(#dropshadow)";
    pie_container.appendChild(year_lable);


    document.getElementById("pie_container").style.boxShadow = "2px 15px 22px lightblue";
    
    
    
    var path_to_data = path_to_folder+state+"_small_all_eds.csv";
        d3.csv(path_to_data, function(error, data) {
  if (error) throw error;
        
            
        var filtered_Women = data.filter(function(d) { 
            if( d["education"] != "All Education Categories" &&
               d["year"]==year && d["industry"]=="00"&& d["sex"]=="Female")
            { return d; } 
            })

        var filtered_Men = data.filter(function(d) { 
            if( d["education"] != "All Education Categories" && d["year"]==year && d["industry"]=="00" && d["sex"]=="Male")
            { return d; } 
            })

        var just_total = data.filter(function(d) { 
            if( d["education"] == "All Education Categories" && d["year"]==year && d["industry"]=="00")
            { return d; } 
            })
        
            // margin
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 600 - margin.right - margin.left,
            height = 600 - margin.top - margin.bottom,
            radius = width/3;

//         color range
        var color = d3.scaleOrdinal()
            .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

         
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        // donut chart arc
        var arc2 = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        // arc for the labels position
        var labelArc1 = d3.arc()
            .outerRadius(radius - 120)
            .innerRadius(radius - 120);
            
        var labelArc2 = d3.arc()
            .outerRadius(radius+40)
            .innerRadius(radius+40);

        // generate pie chart and donut chart
        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.Emp; });
        
        // generate pie chart and donut chart
        var pie2 = d3.pie()
            .sort(null)
            .value(function(d) { return d.Emp; });

        // define the svg for pie chart
        var svg = d3.select("#pie_container").append("svg")
            .attr("id", "mypie")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
      
        // define the svg donut chart
        var svg2 = d3.select("#mypie").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
            var defs = svg2.append("defs");

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

        // clean data types
            data.forEach(function(d) {
                d.Emp = +d.Emp;
                d.sex = d.sex;
            })

          // "g element is a container used to group other SVG elements"
          var g = svg.selectAll(".arc")
              .data(pie(just_total))
            .enter().append("g")
              .attr("class", "arc")
          

          // append path 
          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.sex); })
              .on("mouseover", function (d) {d3.selectAll("."+d.data.sex).style("stroke-width", "5");})
              .on("mouseout", function (d) {console.log(d.data.sex), d3.selectAll("."+d.data.sex).style("stroke-width", "1");})
            .transition()
              .duration(2000)
              .attrTween("d", tweenPie);

          // append text
          g.append("text")
            .transition()
              .duration(2000)
            .attr("transform", function(d) { return "translate(" + labelArc1.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .attr('text-anchor', 'middle')
              .text(function(d) { return d.data.sex; });


            // "g element is a container used to group other SVG elements"
          var g2 = svg2.selectAll(".arc2")
              .data(pie(d3.merge([filtered_Men, filtered_Women])))
            .enter().append("g")
              .attr("class", "arc2")
          .attr("filter", "url(#dropshadow)");

           // append path 
          g2.append("path")
              .attr("d", arc2)
              .style("fill", function(d) { return color(d.data.education); })
            .transition()
              .duration(2000)
              .attrTween("d", tweenDonut);

           // append text
          g2.append("text")
            .transition()
              .duration(2000)
            .attr("transform", function(d) { return "translate(" + labelArc2.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .attr("id", function(d, i) { return "label"+i; })
              .attr('text-anchor', 'middle')
              .text(function(d) { return d.data.education; });

        // Helper function for animation of pie chart and donut chart
        function tweenPie(b) {
          b.innerRadius = 0;
          var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
          return function(t) { return arc(i(t)); };
        }

        function tweenDonut(b) {
          b.innerRadius = 0;
          var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
          return function(t) { return arc2(i(t)); };
        }    
            
    });        
};
