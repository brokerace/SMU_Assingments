// from data.js
var tableData = data;

console.log(tableData);
// Get a reference to the table body
var tbody = d3.select("tbody");

//Refactor to use Arrow Functions
tableData.forEach((sheepleReport) => {
    var row = tbody.append("tr");
    Object.values(sheepleReport).forEach((value) => {
        var cell = row.append("td");
        cell.text(value);
    });
});

// Select the button
var button = d3.select("#filter-btn");
button.on("click", function() {

    // Select the input element and get the raw HTML node
    let inputElement = d3.select("#datetime");
    // Get the value property of the input element
    let inputValue = inputElement.property("value");

    let inputCity = d3.select("#city").property("value").toLowerCase();
    let inputState = d3.select("#state").property("value").toLowerCase();
    let inputCountry = d3.select("#country").property("value").toLowerCase();
    let inputShape = d3.select("#shape").property("value").toLowerCase();

    // alert(inputValue);
    // alert()

    //remove all table body rows
    d3.select("tbody").selectAll("tr").remove()

    //Add logic to avoid null filter
    let filteredData = tableData;
    if (inputValue !== "") {
        filteredData = filteredData.filter(ufoRow => ufoRow.datetime === inputValue);
    }
    if (inputCity !== "") {
        filteredData = filteredData.filter(ufoRow => ufoRow.city === inputCity);
    }
    if (inputState !== "") {
        filteredData = filteredData.filter(ufoRow => ufoRow.state === inputState);
    }
    if (inputCountry !== "") {
        filteredData = filteredData.filter(ufoRow => ufoRow.country === inputCountry);
    }
    if (inputShape !== "") {
        filteredData = filteredData.filter(ufoRow => ufoRow.shape === inputShape);
    }
    console.log(filteredData);

    //Refactor to use Arrow Functions
    filteredData.forEach((sheepleReport) => {
        var row = tbody.append("tr");
        Object.values(sheepleReport).forEach((value) => {
            var cell = row.append("td");
            cell.text(value);
        });


    });


});