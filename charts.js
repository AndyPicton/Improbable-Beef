function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sample0 => sample0.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var item = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = item.otu_ids;
    var otu_label = item.otu_labels;
    var sample_value = item.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_id.slice(0, 10).map(otuId => 'OTU ${otuId}').reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      y: yticks,
      x: sample_value.slice(0, 10).reverse(),
      text: otu_label.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 300,
      height: 375
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        y: sample_value,
        x: otu_id,
        text: otu_label,
        mode: "markers",
        marker: {
          size: sample_value,
          color: otu_id,
          colorscale: "Earth"
        } 
       }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t:0 },
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t:30}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata;
    
    // Create a variable that holds the first sample in the array.
    var metaId = meta.filter(sampleO => sampleO.id == sample); 

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metaId[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(metaResult.wfreq);
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
      domain: {x: [0, 1], y: [0, 1]},
      value: wFreq,
      title: {text:`Belly Button Washing Frequency<br><span style='font-size:15px'><br>Scrubs per Week</span>`},
      type: "indicator", 
      mode: "gauge+number",
      gauge: {
        bar: {color: "black"},
        axis: {range: [0.00, 10.00]},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },

        ]
      } 

    }
  
    ];
    console.log(gaugeData);
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 350, height: 300
      
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}


