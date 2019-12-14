$(document).ready(function () {
    //wczytywanie mapy
    

    
    //tutaj taki kawalek ktory ma pytac o powiekszenie i jezeli nie podane to ustawic je na 12
   
    let mymap = L.map('mymapid', 
        {
            center: [52.5, 21.0], 
            zoom: 7, 
            zoomControl: true, 
            attributionControl: false
        });
    
    // warstwa z mapą
    let lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    
    //warstwa z mapą z lokalnego geoservera
    var  lyrPRG = L.tileLayer.wms("http://localhost:8095/geoserver/ate_projekt/wms", 
        {
            layers: "ate_projekt:gminy", 
            format: 'image/png', 
            transparent : 'true', 
            version : '1.1.1'
        });
    //warstwa z mapą z geoportalu
    var lyrORTO = L.tileLayer.wms("http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer", 
        {
            layers: "Raster", 
            format: 'image/png', 
            transparent : 'true', 
            version : '1.1.1'
        });   
    //warstwa z mapą z geoportalu
    var lyrSozo = L.tileLayer.wms("http://mapy.geoportal.gov.pl/wss/service/img/guest/SOZO/MapServer/WMSServer",
         {
            layers: "Raster", 
            format: 'image/png',
             transparent : 'true', 
            version : '1.1.1'
         });
    //wczytywanie warstwy po załadowaniu
    mymap.addLayer(lyrOSM);
    
    //stylizacja skali
    L.control.scale({position:'bottomleft',imperial:false, maxWidth:200}).addTo(mymap);
    
    //wybór map
     var baseMaps = {
            "Openstreetmap": lyrOSM,
            "Gminy": lyrPRG,
            "Ortofotomapa": lyrORTO,
            "Mapa Sozologiczna": lyrSozo,
      };
    
    //polecenie dodania funkcji wyboru map do strony
    L.control.layers(baseMaps).addTo(mymap);
    
    //polecenie dodania funkcji wyboru map do strony
    L.control.mousePosition().addTo(mymap);

    //console.log(Object.values(mymap.getBounds()).map((item)=>{return [item.lng, item.lat]}));

    let [a1,b1,c1,d1] = Object.values(mymap.getBounds()).map((item)=>{return [item.lng, item.lat]}).flat();




    //polygon

    var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
    };


    randomPolygonGeometryObjectArrayGenerator(a1,c1,b1,d1);
    let mapArrayofPolygons= randomFeatureClassArrayPolygon.map((item)=>{
            return item.geometry.coordinates
        });
    //console.log(mapArrayofPolygons);
    let tspolygon = performance.now();
    L.geoJSON(randomFeatureClassArrayPolygon,
        {
            style:myStyle,
            onEachFeature: onEachFeature
    }).addTo(mymap);
    let tkpolygon=performance.now();
    console.log(`the array of polygon was load in ${((tkpolygon-tspolygon)/1000).toFixed(6)} seconds`);
    


    //points 
    randomGeometryObjectArrayGenerator(a1,c1,b1,d1);
    let mapArray= randomFeatureClassArray.map((item)=>{
        return item.geometry.coordinates
    });
    //console.log(mapArray)

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(
                `spec = ${feature.properties.name},<br/>
                id = ${feature.properties.id}, <br/>
                dlugosc = ${feature.geometry.coordinates[0]}, <br/>
                szerokosc = ${feature.geometry.coordinates[1]}` 
             );
    }
};

let geojsonMarkerOptions = {
    radius: 3,
    fillColor: "#7599a1",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

let geojsonFeature = randomFeatureClassArray;
let ts=performance.now();
L.geoJSON(randomFeatureClassArray, {
    pointToLayer: function (feature, latlng) {

        return L.circleMarker(latlng, geojsonMarkerOptions);
    },onEachFeature: onEachFeature
}).addTo(mymap);
let tk=performance.now();
console.log(`the array of points was load in ${((tk-ts)/1000).toFixed(6)} seconds`);
});
