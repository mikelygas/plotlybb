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
     //otu10 i distinct color b/c not being used
    var otu_10 = otu_ids.slice(0,10);
    var otulabel_10 = otu_labels.slice(0,10);
    var sample_10 = sample_values.slice(0,10)


    

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode: 'markers',
      marker: {
        size:sample_values,
        color:otu_ids
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 800
    };
    
    Plotly.plot("bubble",data,layout)
  

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values:sample_10,
      labels:otulabel_10,
      type: 'pie'
    }];
    
    var layout = {
      height: 600,
      width: 1500
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
