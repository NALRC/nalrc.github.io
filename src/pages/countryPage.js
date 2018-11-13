var languageButtons = [];

function openToCountryFromMap(country){
    if(this.currentState == "countryMap"){
    	currentCountry = country.properties.name_long;
        openCountryPage();
    }
}

function flyToCountry(){
	geojson.eachLayer(function (layer) {
    	if (layer.feature.properties.name_long === currentCountry) {
    		map.flyToBounds(layer.getBounds());
    	}
    });
}

function createLanguageButtons(country){
	var languages = country.properties.languages;
	
	for(var ind in languages){
		var btn = document.createElement("BUTTON");
		countryMapUi.appendChild(btn);
		btn.className = "toLanguage";
		btn.style.top = (80 + 30 * ind) + 'px';
		var language = languages[ind];
		btn.innerHTML = language;
		btn.onclick = openLanguagePage;

		languageButtons.push(btn);
	}
}


function openCountryPage(event){
	try {currentCountry = event.target.innerHTML;} catch(error){};
	var country;
	geojson.eachLayer(function (layer) {
    	if (layer.feature.properties.name_long === currentCountry) {
    		country = layer.feature.properties;
    	}
    });
	createButtons(languageButtons, "toLanguage", country.languages, countryMapUi, 80, 30, openLanguagePage);
	console.log('opening ' + currentCountry);
	currentCountryNameText.innerHTML = currentCountry;
	pageTransition("countryPage");
	var mapUiStyle = countryMapUi.style;
	mapUiStyle.opacity = 1;
	currentCountryLanguagesText.style.opacity = 0;
	mapUiStyle.width = '730px';
    mapUiStyle.left = '35px';
    flyToCountry();
    setTimeout(()=>{
    	backToCountryMap.style.opacity = 1;
    	//toLanguage.style.opacity = 1;
    },300);
}

function slideCloseCountryPage(){
	var mapUiStyle = countryMapUi.style;
	mapUiStyle.opacity = 0;
	mapUiStyle.left = '765px';
	mapUiStyle.width = '0px';
}

function closePageToMap(){
	countryMapUi.style.width = '255px';
    countryMapUi.style.left = '510px';
	backToCountryMap.style.opacity = 0;
	//toLanguage.style.opacity = 0;
	currentCountryLanguagesText.style.opacity = 1;
	destroyButtons(languageButtons);
}