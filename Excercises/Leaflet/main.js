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
    
    //polecenie dodania funkcji wskazywania współrzednych geogeraficznych kursora
    L.control.mousePosition().addTo(mymap);
    
    //funcja do sprawdzania obszaru gdzie jest okno mapy
    let [a1,b1,c1,d1] = Object
                            .values(
                                mymap.getBounds()
                                )
                            .map((item)=>{
                                //console.log(item);
                                //console.log(mymap.getBounds());
                                return [item.lng, item.lat]
                            })
                            .flat();


    //obliczanie wymiarow terenowych okna mapy w km

    let l1=mymap.getBounds()._southWest;
    let l2=mymap.getBounds()._northEast;
    console.log(l1.distanceTo(l2)/1000+" km");
    //tutaj dokończyć kawałek który pozwoli obliczyć optymalne natężenie informatycje i na tej podstawie wskaże obiekty

    //polygon
    //stylizacja dla poligonu
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
    })//.addTo(mymap);
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
                szerokosc = ${feature.geometry.coordinates[1]}
                ${this}
                ` 
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

//tutaj generuje i dodaje obiekty punktowe
let geojsonFeature = randomFeatureClassArray;
 //performance measurement
    let ts=performance.now();//start pomiaru czasu
    let aaa = L.geoJSON(randomFeatureClassArray, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
    }).addTo(mymap);
    let tk=performance.now(); // koniec pomiaru czasu
    console.log(`the array of points was load in ${((tk-ts)/1000).toFixed(6)} seconds`);
    
    //funkcja która dodaje opis pod mapą
    function loadData(array){
    array.forEach((item, i)=>{
        $("#userData").append(`
            <div class="user" id="${i}">
                <h3>${item.properties.name} ${item.properties.id}</h3>
                    <p>Object location:
                        ${item.geometry.coordinates[0]} E° , 
                        ${item.geometry.coordinates[1]} N° <br/>
                      Object name : 
                        ${item.properties.name} <br/>
                      Object identyficator: 
                        <div id="nrObiektu">${item.properties.id}</div>
                    </p>
            </div>`);
    });
    };
    loadData(randomFeatureClassArray);

$("#filter").click((event)=>
    {
        //console.log(event.target.value)
        //wartosc z warunekWartosc 
        let warunek=$("#WW").val();
        //console.log(text11);
        filterArrays(randomFeatureClassArray,warunek);
        //console.log(filterArrays(randomFeatureClassArray,1));
        aaa.setStyle({
            fillOpacity:0.55,
            color:"",
            //fillColor:"#42eff5"
        });

        //wyświetlaj przefiltrowane dane przestrzenne
        L.geoJSON(filteredArray, {
            style: function(){
                //zmiana wartości diva po przerpwaodzaeniu zapytania (zwraca długość przewiltrowanej tabeli i kryterium)
                $("#anwser").text(`Obiektow ktorych wartość id <${warunek} jest ${filteredArray.length}`);
                //przywrocenie wartości poczatkowej pola na potrzeby dalszego filtrowania
                $("#WW").val("");
                return {
                    color:"#32a852",
                    fillColor:"#eb0505",
                    weight:1,
                    className: 'blinking'
                }
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature,

        }).addTo(mymap);

    }
);

let blinker = {
                    color:"#32a852",
                    fillColor:"#eb0505",
                    weight:1,
                    className: 'blinking'
                };

let marker;
    $(".user")
    .mouseenter(function(){ 
        let numberSelected = Number(this.id)
            console.log(numberSelected);
        console.log();
                let a1= Number(randomFeatureClassArray[numberSelected].geometry.coordinates[0]);
                let a2= Number(randomFeatureClassArray[numberSelected].geometry.coordinates[1]);
                    let latlng = L.latLng(a2, a1);
                    //funkcja pokazuje mrugający marker
                    mymap.panTo(latlng);
                    marker=L.circleMarker(latlng, blinker).addTo(mymap);
                console.log(latlng)
    })
    .mouseout(function(){
        console.log("aaa");
        setTimeout(() => {
            mymap.removeLayer(marker);
        }, 2000);
         
    })


});
