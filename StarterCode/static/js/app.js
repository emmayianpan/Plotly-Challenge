function dropdownMenu() {
  //Use the D3 library to read in `samples.json`
  d3.json("samples.json").then(function (data) {
    console.log(data);
    var otuID = data.names;
    console.log(otuID)
    //read id and display inside dropdown menu 
    for (var i = 0; i < otuID.length; i++) {
      dropdown = d3.select("#selDataset").append("option").text(otuID[i]);
    }

    var firstID = otuID[0];
    console.log(firstID);
    buildChart(firstID);
  })
}; 

function buildChart(sampleID) {
  d3.json("samples.json").then(function (data) {
      //Sample Data
      var sampleData = data.samples.filter(x => x.id === sampleID)[0];
      var sampleValues = sampleData.sample_values;
      var OtuIDs = sampleData.otu_ids;
      var OtuLabels = sampleData.otu_labels;
      var metadataD = data.metadata.filter(x => x.id == sampleID)[0]
      console.log(metadataD); 
      var sampleWfreq = metadataD.wfreq

      var location = d3.select("#sample-metadata"); 
      location.html(""); 
      Object.entries(metadataD).forEach(([key, value]) => {
        console.log(value)
        var row = location.append("tr"); 
        var cell = row.append("td")
          cell.text(key)
        var cell = row.append("td")
          cell.text(`:${value}`)
      }); 

      //Reverse Data 
      var top10 = sampleValues.slice(0, 10).reverse();
      var top10IDs = OtuIDs.slice(0, 10).reverse().map(otu => "OTU" + otu)
      var top10Labels = OtuLabels.slice(0, 10).reverse()
      
      //Plotting
      var trace1 = {
        type: "bar",
        x: top10,
        y: top10IDs,
        text: top10Labels,
        orientation: "h"
      };
      var data1 = [trace1];
      Plotly.newPlot("bar", data1);

      var trace2 = {
        x: OtuIDs,
        y: sampleValues,
        text: OtuLabels,
        mode: 'markers',
        marker: {
          color: OtuIDs,
          size: sampleValues,
          colorscale: "YlGnBu"
        }
      };
      var layout = {
        showlegend: false,
        height: 500,
        width: 1200
      };
      var data2 = [trace2];
      Plotly.newPlot("bubble", data2, layout);

      var trace3 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: sampleWfreq,
        title: { text: "Belly Button Washing Frquency Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 9] }
        }
      };
      var layout = {
        width: 500,
        height: 500
      };
      var data3 = [trace3];
      Plotly.newPlot("gauge", data3, layout);

    });
}

function optionChanged(sampleID) {
  buildChart(sampleID)
}

dropdownMenu(); 