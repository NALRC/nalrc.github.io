var currentLanguage;
var languagePageCountryButtons = [];
var languagePageBookButtons = [];

function openLanguagePage(event){
	closeMapUi();
	languageToListButton.style.left = '500px';
	backToLanguageMap.style.pointerEvents = 'all';
	backToLanguageMap.style.opacity = 1;
	try{currentLanguage = event.target.innerHTML;}
	catch(error){currentLanguage = event;}
	console.log("opening " + currentLanguage)
	languageName.innerHTML = currentLanguage;
	languageUi.style.width = '730px';
	languageUi.style.opacity = 1;
	languageName.style.opacity = 1;
	languageUi.style.pointerEvents = 'all';
	brochureButton.style.pointerEvents = 'all';
	brochureButton.style.opacity = 1;
	var layers = [];
	geojson.eachLayer(function (layer) {
		var layerCountry = layer.feature.properties.name_long;
    	if (languageData.languages[currentLanguage].countries.includes(layerCountry)) {
    		layers.push(layer);
    	}

    });
    var featureGroup = L.featureGroup(layers);
    map.flyToBounds(featureGroup.getBounds());
	slideCloseCountryPage();
	pageTransition("languagePage");
	createBookButtons();
	createButtons(languagePageCountryButtons, 'languagePageCountryButton', languageData.languages[currentLanguage].countries, languageUi, 80, 30, languageToCountry);
	brochureButton.onclick = function(){window.open('https://nalrc.indiana.edu/doc/brochures/'+currentLanguage.toLowerCase()+'.pdf')};
}

function languageToCountry(event){
	closeLanguagePage();
	openCountryPage(event);
}

function closeLanguagePage(){
	languageUi.style.width = '0px';
	languageName.style.opacity = 0;
	languageUi.style.opacity = 0;
	languageUi.style.pointerEvents = 'none';
	removeLanguageButtons();
}

function removeLanguageButtons(){
	destroyButtons(languagePageCountryButtons);
	destroyButtons(languagePageBookButtons);
	languagePageCountryButtons = [];
	languagePageBookButtons = [];
}

function closeLanguagePageToMap(){
	languageUi.style.width = '255px';
	removeLanguageButtons();
	brochureButton.style.opacity = 0;
	backToLanguageMap.style.opacity = 0;
	languageToListButton.style.left = '100px';
	backToLanguageMap.style.pointerEvents = 'none';
	brochureButton.style.pointerEvents = 'none';
	languageName.style.opacity = 1;
}

function languageToList(){
	closeLanguagePage();
	openListPage('language');
	closeMapUi();
}

function createBookButtons(){
	var books = languageData.books;
	var buttons = [];
	for(var b in books){
		if(books[b].languages.includes(currentLanguage)){
			buttons.push(b);
		}
	}
	if(buttons != []){
		createButtons(languagePageBookButtons, 'languagePageBookButton', buttons, languageUi, 80, 30, openBook);
	}
}

function openBook(event){
	var book = event.target.innerHTML;
	var link = languageData.books[book].url;
	window.open(link);
}

function setCurrentLanguageMap(languages){
	var mostCommon = {'language':"", 'numCountries': 0};

	for(var l in languages){
		var curL = languages[l];
		var numOfCountries = languageData.languages[languages[l]].countries.length;
		if(numOfCountries > mostCommon.numCountries){
			mostCommon = {'language': curL, 'numCountries': numOfCountries};
		}
	}

	languageName.innerHTML = mostCommon.language;
}