function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // sample-metadata is element on the html page
  var panel = d3.select("#sample-metadata")

 // Use `.html("") to clear any existing metadata
   panel.html("")

  //calls the Flask endpoint for correct id for metadata.  
  // Once the promise resolves, the data can be rendered  
  d3.json("/metadata/"+sample).then(function(data){

   // Use `Object.entries` to add each key and value pair to the panel 
    Object.entries(data).forEach(([key,value]) => { 

      // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      panel.append("h6").text(`${key}: ${value}`)
    })
  })
 

 }


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  //use backticks not single ticks b/c using variable in string
  d3.json(`/samples/${sample}`).then((sampleNames) => {
     var otu_ids = sampleNames.otu_ids;
     var otu_labels = sampleNames.otu_labels;
     var sample_values = sampleNames.sample_values;
    
    otuData = [];
    otuData = otu_ids.map((d, i) => {
      return {otu_id: d, sample_value: sample_values[i], otu_label: otu_labels[i]}
    });

    // Sort data by sample_values and select top 10 values
    otuData.sort((a, b) => b.sample_value-a.sample_value);
    otuData = otuData.slice(0,10);

    

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuData.map(d => d.otu_id),
      y: otuData.map(d => d.sample_value),
      text: otuData.map(d => d.otu_label),
      mode: 'markers',
      marker: {
        color: otuData.map(d => d.otu_id),
        size: otuData.map(d => d.sample_value)
      }
    
    };
 
    var data = [trace1];
 
    var layout = {
      title: '',
      showlegend: false,
      height: 600,
      width: 1200
    };
 
    Plotly.plot("bubble",data,layout);
 
  

    // @TODO: Build a Pie Chart
    
    var data = [{
      values:otuData.map(d => d.sample_value),
      labels:otuData.map(d=> d.otu_id),
      hovertext: otuData.map(d => d.otu_label),
      type: 'pie'
    }];
 
    var layout = {
      showlegend:true,
      height: 600,
      width: 1200
    };
 
    Plotly.newPlot('pie', data, layout);
 
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
    const firstSample = sampleNames[13];
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
