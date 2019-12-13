function randomNumber(min, max){
	
    let random = ((Math.random()*(max-min+1))+min).toFixed(4);
return random
};

function objectGenerator(a,b,c,d,e){
	
	let basicClassObject = {
	  "type": "Feature",
	  "geometry": {
	    "type": "Point",
	    "coordinates": [randomNumber(a, b), randomNumber(c,d)]
	  },
	  "properties": {
	    "name": "Dinagat Islands",
	    "id": e
	  }
	};
	//basicClassObject.geometry.coordinates=[randomNumber(20.13666, 21.875), randomNumber(51.87,52.3160)];
	let newFeatureClassObcject= JSON.parse(JSON.stringify(basicClassObject));
return newFeatureClassObcject;
};

let randomFeatureClassArray= [];
function randomGeometryObjectArrayGenerator(a,b,c,d){

	let t0=performance.now();
	
	for (let i=0;i<100;i++){
		randomFeatureClassArray.push(objectGenerator(a,b,c,d,i));
	};
	let t1=performance.now();
	console.log(`the array was generated in  ${t1-t0} miliseconds`)
};
