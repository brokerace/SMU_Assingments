var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
d3.json(url1, function(data) {
    createFeatures(data.features);
});
var pirate = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: "pk.eyJ1Ijoic2hhd25hZHZhbmkiLCJhIjoiY2s0NXN6N294MDlubjNmbnh1NzZsNTZ0aSJ9.G6orb01lEUAZt9pllFtLNw"
});
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1Ijoic2hhd25hZHZhbmkiLCJhIjoiY2s0NXN6N294MDlubjNmbnh1NzZsNTZ0aSJ9.G6orb01lEUAZt9pllFtLNw"
});
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1Ijoic2hhd25hZHZhbmkiLCJhIjoiY2s0NXN6N294MDlubjNmbnh1NzZsNTZ0aSJ9.G6orb01lEUAZt9pllFtLNw"
});

var baseMaps = {
    "Pirate Map": pirate,
    "Satellite Map": satellite,
    "Dark Map": darkmap,
};

function getRadius(value) {
    return value * 30000
};

function getColor(scale) {
    return scale > 5 ? "#FF0000" :
        scale > 4 ? "#FF8C00" :
        scale > 3 ? "#FFFF00" :
        scale > 2 ? "#ADFF2F" :
        scale > 1 ? "#9ACD32" :
        "#00FF00";
};

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity: .6,
                color: "#000",
                stroke: true,
                weight: .8
            })
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var faults = new L.LayerGroup();
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": faults
    };
    var myMap = L.map("map", {
        center: [
            0, 0
        ],
        zoom: 3,
        layers: [pirate, earthquakes, faults]
    });
    d3.json(url2, function(plateData) {
        L.geoJson(plateData, {
                color: "purple",
                weight: 2
            })
            .addTo(faults);
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            scale = [0, 1, 2, 3, 4, 5],
            labels = [];
        for (var i = 0; i < scale.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(scale[i] + 1) + '"></i> ' +
                scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
};