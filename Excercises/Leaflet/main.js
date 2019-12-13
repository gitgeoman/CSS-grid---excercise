$(document).ready(function () {
    //wczytywanie mapy
    let mymap = L.map('mymapid', 
        {
            center: [52.5, 21.0], 
            zoom: 10, 
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
    
    L.control.mousePosition().addTo(mymap);

    console.log(mymap.getBounds());

    let [a1,b1,c1,d1] = Object
                            .values(
                                mymap.getBounds()
                                )
                            .map((item)=>{return [item.lng, item.lat]})
                            .flat();
 
    randomGeometryObjectArrayGenerator(a1,c1,b1,d1);
    let mapArray= randomFeatureClassArray.map((item)=>{return item.geometry.coordinates});
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

let geojsonFeature = randomFeatureClassArray;
L.geoJSON(randomFeatureClassArray, {onEachFeature: onEachFeature}).addTo(mymap);




});
