//funkcja która losuje liczbę z przedziału (liczba rzeczywista)
function randomNumber(min, max){
	    let random = ((Math.random()*(max-min))+min).toFixed(4);
return random
};
//api do łapania danych 
const url='https://uinames.com/api/?amount=25';
fetch(url)
	.then((resp) => {
		console.log(resp[1].name);
	})
	.then(json=>console.log(json))
	.catch(function(error){

	});
//koniec obsługi api do łapania danych




function pointObjectGenerator(a,b,c,d,e){

	let basicPonintObject = {
	  "type": "Feature",
	  "geometry": {
	    "type": "Point",
	    "coordinates": [randomNumber(a, b), randomNumber(c,d)]
	  },
	  "properties": {
	    "name": "Dinagat Islands",
	    "id": e+1
	  }
	};
	//basicClassObject.geometry.coordinates=[randomNumber(20.13666, 21.875), randomNumber(51.87,52.3160)];
	let newFeatureClassObcject= JSON.parse(JSON.stringify(basicPonintObject));
return newFeatureClassObcject;
};

let randomFeatureClassArray= [];
function randomGeometryObjectArrayGenerator(a,b,c,d){
	let t0=performance.now();
	for (let i=0;i<50;i++){
		randomFeatureClassArray.push(pointObjectGenerator(a,b,c,d,i));
	};
	let t1=performance.now();
	console.log(`the array of points was generated in  ${((t1-t0)/1000).toFixed(6)} seconds`)
};
//single polygon generator
function polygonObjectGenerator(a,b,c,d,e){
	let pkt1=[randomNumber(a, b), randomNumber(c,d)]
	let arrayPolygonCoordinates = [];
	arrayPolygonCoordinates.push(pkt1);
	//petla losuje ilosc petli i tyle razy ile zostanie zainicjowana tworzy punkt i wysyla go do tabeli
	for(let k=3;k<(randomNumber(3,10));k++){
		let pkt =[randomNumber(a, b), randomNumber(c,d)]
		arrayPolygonCoordinates.push(pkt);
	};
	arrayPolygonCoordinates.push(pkt1);
	//console.log(arrayPolygonCoordinates);

	let basicPolygonObject =   { 
		"type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             arrayPolygonCoordinates
             ]
         },
         "properties": {
           "name": "nameValue",
           "id": e+1
           }
     };
 	let newFeatureClassObcject= JSON.parse(JSON.stringify(basicPolygonObject));
	return newFeatureClassObcject;
 };

let randomFeatureClassArrayPolygon= [];
function randomPolygonGeometryObjectArrayGenerator(a,b,c,d){

	let t0=performance.now();
	
	for (let i=0;i<50;i++){
		randomFeatureClassArrayPolygon.push(polygonObjectGenerator(a,b,c,d,i));
	};
	let t1=performance.now();
	console.log(`the array of polygons was generated in  ${((t1-t0)/1000).toFixed(6)} seconds`)
};

//filtrowanie danych 
let filteredArray =[];
function filterArrays(arrayTofilter,parameter){
	filteredArray = arrayTofilter.filter((item)=>{
		//console.log(item.properties.id>1);
		return item.properties.id<parameter;
	})
};
