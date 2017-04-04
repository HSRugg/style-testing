
//making some global vars
var emp_min = 2900;
yColumn = "avrage_pay";

var outerWidth = 700;
var outerHeight = 700;
var margin = { left: 90, top: 5, right: 20, bottom: 60 };
var xColumn = "year";
yColumn = "avrage_pay";
var lineColumn = "industry";
var xAxisLabelText = "Year";
var xAxisLabelOffset = 48;
var yAxisLabelText = "Average Pay";
var yAxisLabelOffset = 60;
var innerWidth  = outerWidth   - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;
  // scales for axis
xScale = d3.scaleTime().range([0, innerWidth]);
yScale = d3.scaleLinear().range([innerHeight, 0]);
 // formate ticks for axis
var siFormat = d3.format("s");
var customTickFormat = function (d){
return siFormat(d).replace("G", "B");
};

// add axis
var xAxis = d3.axisBottom().scale(xScale)
.ticks(8);
var yAxis = d3.axisLeft().scale(yScale)
.ticks(6)
.tickFormat(customTickFormat);

d3.select("yAxis")
    .attr("id", "y_axis")
    .attr("d", 'd="M-6,0H0V741H-6"');

// difine lines
line = d3.line()
    .x(function(d) { return xScale(d[xColumn]); })
    .y(function(d) { return yScale(d[yColumn]); });

console.log('here:');
var make_inds_lines = function (state) {
    
    d3.select("svg").remove();
    d3.select("#tooltip").remove();

    try {
        d3.select("#tooltip").remove();
    document.getElementById("heading").innerHTML = "Displying Data For "+state;
        }
    catch (err) {
        var heading = document.createElement("h2");
        heading.setAttribute("id", "heading");
        heading.innerHTML = "Displying Data For USA";
        heading.style.paddingTop = 110;
        heading.style.paddingBottom = 30;
        heading.style.margin = "auto";
        heading.style.textAlign = "center";
        document.body.appendChild(heading);
        }
    // make div for line plot
    var line_plot = document.createElement('div');
        line_plot.id = "line_plot";
        line_plot.setAttribute("class", "chart_holder");
        line_plot.style.position = "relative";
        line_plot.style.cssFloat = "left";
        line_plot.style.padding = 50;
        line_plot.style.paddingLeft = 40;
        line_plot.style.marginLeft = 200;
        line_plot.style.boxShadow = "2px 15px 22px lightblue";
        line_plot.style.borderRadius = "14px";
    
    
    // append the body
    document.body.appendChild(line_plot);

    //append svg to div got line plot
    var svg = d3.select("#line_plot").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight);
    
    // create a group to move things togeather with prior defined values
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    // add axis to the group with prior defined values
    var xAxisG = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerHeight + ")")
    var xAxisLabel = xAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
        .attr("class", "label")
        .style("font-size","15px")
        .text(xAxisLabelText);
    var yAxisG = g.append("g")
        .attr("class", "y axis");
    var yAxisLabel = yAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
        .attr("class", "label")
        .style("font-size","15px")
        .text(yAxisLabelText);
    
        

    
    //legend
    var colorLegendG = g.append("g")
        .attr("class", "color-legend")
        .attr("transform", "translate("+(outerWidth-700) +", 20)");
    
    // color scale should be the same in inds_rank_bars
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


    function render(data){
            
        data = data.filter(function(d) { 
            if(d["industry"]!= "00" && d["state"] == state)
            { return d; } 
            })
        
        emp_max = d3.max(data, function (d){ return d['Emp']});
        avg_pay_max = d3.max(data, function (d){ return d['avrage_pay']});

        xScale.domain(d3.extent(data, function (d){ return d[xColumn]; }));
        yScale.domain([d3.min(data, function (d){ return d[yColumn]*.8; }), avg_pay_max*1.08]);
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        var nested = d3.nest()
          .key(function (d){ return d[lineColumn]; })
          .entries(data);
        colorScale.domain(nested.map(function (d){ return d.key; }));
        var paths = g.selectAll(".chart-line")
            .data(nested);
        paths.enter().append("path")
            .attr("class", "chart-line")
            .attr("id", function (d){ return d.key.split(' ').join('').replace("(", "").replace(")","").split(',').join(''); })
        .attr("d", function (d){ return line(d.values); })
            .attr("stroke", function (d){ return colorScale(d.key); })
            .style("fill", "none");
            
    }
    function type(d){
        d.year = new Date(d.year);
        d.avrage_pay = +d.avrage_pay;
        d.Emp = +d.Emp;
        return d;
    }
    
    d3.csv("/d3_testing/Pages/industry_data.csv", type, render);
    


//    function type2(d){
//        d.year = new Date(d.year);
//        d.Emp = +d.Emp;
//        return d;
//    }
    
    
var change_data = function () { 
    document.getElementById("change_data_button").innerHTML = "Showing Emplyment"
    document.getElementById("change_toPay_button").innerHTML = "Switch To Avrage Pay"
    document.getElementById("change_data_button").style.backgroundColor = "skyblue"
    document.getElementById("change_toPay_button").style.backgroundColor = "ivory"
    document.getElementsByClassName("label")[1].innerHTML = "Number of People Employed";
    innerWidth  = outerWidth   - margin.left - margin.right;
    innerHeight = outerHeight - margin.top  - margin.bottom;

          // scales for axis
    xScale = d3.scaleTime().range([70, innerWidth]).domain([2004,2011]);
    yScale = d3.scaleLinear().range([innerHeight, 0])
    .domain([0,emp_max*1.1]);

    //    console.log("test");
    //    d3.selectAll("path").remove();
    //d3.csv("/d3_testing/Pages/industry_data.csv", type, render);

    var line2 = d3.line()
    .x(function(d) { return xScale(d["year"].getFullYear()); })
    .y(function(d) { return yScale(d["Emp"]); });
    

    d3.selectAll(".chart-line").transition()
        .duration(3000)
        .attr("d", function (d){ return line2(d.values)});
    
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(6)
        .tickFormat(customTickFormat);
    yAxisG.transition()
        .duration(3000)
        .call(yAxis);  
 
}

var change_to_pay = function () { 
    document.getElementById("change_data_button").innerHTML = "Switch To Emplyment"
    document.getElementById("change_toPay_button").innerHTML = "Showing Avrage Pay"
    document.getElementById("change_data_button").style.backgroundColor = "ivory"
    document.getElementById("change_toPay_button").style.backgroundColor = "skyblue"
    document.getElementsByClassName("label")[1].innerHTML = "Number of People Employed";
    innerWidth  = outerWidth   - margin.left - margin.right;
    innerHeight = outerHeight - margin.top  - margin.bottom;

          // scales for axis
    xScale = d3.scaleTime().range([70, innerWidth]).domain([2004,2011]);
    yScale = d3.scaleLinear().range([innerHeight, 0])
    .domain([0,avg_pay_max*1.1]);

    line2 = d3.line()
        .x(function(d) { return xScale(d["year"].getFullYear()); })
        .y(function(d) { return yScale(d["avrage_pay"]); });
    
    //    use line, not line2, to switch back
    d3.selectAll(".chart-line").transition()
        .duration(3000)
        .attr("d", function (d){ return line2(d.values)});
    
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(6)
        .tickFormat(customTickFormat);
    yAxisG.transition()
        .duration(3000)
        .call(yAxis);  
 
}


var change_toPay_button = document.createElement("BUTTON");
    change_toPay_button.setAttribute("id", "change_toPay_button"); document.getElementById("heading").appendChild(change_toPay_button);
    change_toPay_button.innerHTML = "Showing Avrage Pay"
    change_toPay_button.style.backgroundColor = "skyblue";
    change_toPay_button.style.borderRadius = "20px";
    change_toPay_button.style.padding = "12px";
    change_toPay_button.style.marginLeft = "20px";
    change_toPay_button.style.marginBottom = "12px";
    change_toPay_button.addEventListener("click", change_to_pay);
    
var change_data_button = document.createElement("BUTTON");
    change_data_button.setAttribute("id", "change_data_button"); document.getElementById("heading").appendChild(change_data_button);
    change_data_button.innerHTML = "Switch to Emplyment"
    change_data_button.style.backgroundColor = "ivory";
    change_data_button.style.borderRadius = "20px";
    change_data_button.style.padding = "12px";
    change_data_button.style.marginLeft = "20px";
    change_data_button.style.marginBottom = "2px";
    change_data_button.addEventListener("click", change_data);
    

    

}