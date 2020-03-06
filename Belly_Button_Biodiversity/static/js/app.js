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
      panel_meta.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // inside the loop use d3 to append new
    // tags for each key-value in the metadata.
    
      Object.entries(sample_data).forEach(([key,value]) => {
        panel_meta.append("li").text(`${key}: ${value}`); //li or something else?
      });

    })
}


function buildCharts(sample) {

  //  Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    console.log(data);
    
    // Below creates a Bubble Chart that uses data from the samples route (/samples/<sample>) 
    // to display each sample.

    // otu_ids for the x values.
    // sample_values for the y values.
    // sample_values for the marker size.
    // otu_ids for the marker colors.
    // otu_labels for the text values.

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

  // below code chunk builds a pie chart
    // use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // The PIE chart uses data from the samples route (/samples/<sample>) to display the top 10 samples.
    
    // sample_values as the values for the PIE chart.
    // otu_ids as the labels for the pie chart.
    // otu_labels as the hovertext for the chart.
    
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
