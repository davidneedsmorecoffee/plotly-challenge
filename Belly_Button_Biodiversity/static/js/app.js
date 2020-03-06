function buildMetadata(sample) {

  //// the follwoing code chunk is for live-java-scripting testing in browser console
  // d3.json(`/metadata/${950}`).then(function(sample_data){console.log(sample_data); Object.entries(sample_data).forEach(([key,value]) => {
  //   d3.select(`#sample-metadata`).append("li").text(`${key}: ${value}`);});});
  //// use this to clear the meta)data d3.select(`#sample-metadata`).html("")
  var url = `/metadata/${sample}`;
  
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(sample_data){
    console.log(sample_data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel_meta = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    //// Similar to 09-Par_Form_Filter example
      panel_meta.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    //// Similar to 03-Evr_D3_Table
    //// Similar to 14_3_05-Stu_onChange (bonus)
    
      Object.entries(sample_data).forEach(([key,value]) => {
        panel_meta.append("li").text(`${key}: ${value}`); //li or something else?
      });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // https://com2m.de/blog/technology/gauge-charts-with-plotly/
    })
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
      //// 15_02_03-Ins_D3-JSON

  d3.json(`/samples/${sample}`).then(function(data) {
    console.log(data);
    
    // @TODO: Build a Bubble Chart using the sample data    
    // Create a Bubble Chart that uses data from your samples route (/samples/<sample>) to display each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    // https://plot.ly/javascript/colorscales/
    var bubble_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Portland"
      }
    }];      

    var bubble_layout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
    };

    Plotly.plot('bubble', bubble_data, bubble_layout);

  // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // Create a PIE chart that uses data from your samples route (/samples/<sample>) to display the top 10 samples.
    // Use sample_values as the values for the PIE chart.
    // Use otu_ids as the labels for the pie chart.
    // Use otu_labels as the hovertext for the chart.
    
    //14_01_04-Evr_JavaScript_Arrays
    // console.log(sample_values.slice(0, 10));
    // console.log(sample_values.slice(0, 3));
    var pie_data = [{
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }];
    
    var pie_layout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pie_data, pie_layout)

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
