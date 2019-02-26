var currentState = "countryMap";
var currentCountryNameText = document.getElementById("mouseOverCountryName");
var currentCountryLanguagesText = document.getElementById("mouseOverCountryLanguages")
var countryUi = document.getElementById("countryUi");
var backToCountryMap = document.getElementById("backToCountryMap");
var languageUi = document.getElementById("languageUi");
var languageName = document.getElementById("languageName");
var backToLanguageMap = document.getElementById("backToLanguageMap");
var languagePageNav = document.getElementById("languageNav");
var toPage1 = document.getElementById('toPage1');
var toPage2 = document.getElementById('toPage2');
var toPage3 = document.getElementById('toPage3');
var languagePageButtons = [toPage1, toPage2, toPage3];
var languagePage1 = document.getElementById('languagePage1');
var languagePage2 = document.getElementById('languagePage2');
var languagePage3 = document.getElementById('languagePage3');
var languagePages = [languagePage1, languagePage2, languagePage3];
var englishText = document.getElementById('englishText');
var yorubaText = document.getElementById('yorubaText');
var playAudioButton = document.getElementById('playAudioButton');
var languageRecording = document.getElementById('languageRecording');
var mapToListButton = document.getElementById("mapToListButton");
var brochureButton = document.getElementById("brochure");
var listUi = document.getElementById("listUi");
var closeTopUiButton = document.getElementById("closeTopUiButton");
var switchListButton = document.getElementById("switchList");
var listUiTitle = document.getElementById("listTitle");
var changeMapButton = document.getElementById("changeMapButton");
var welcomePage = document.getElementById("welcomePage");
var startButton = document.getElementById("startButton");
var tickets = document.getElementById("tickets");
var topUi = document.getElementById("topUi");
var infoButton = document.getElementById("infoButton");
var contactUs = document.getElementById("contactUs");


var countryList = [];
var languageList = [];
var languageCountryGroups = [];
var topUiButtons = [];
topUiButtons.push(infoButton);
topUiButtons.push(contactUs);
topUiButtons.push(mapToListButton);
topUiButtons.push(changeMapButton);


var mapMode = "country";
var mainMapCoordinates = L.point(5, 38);
var mainMapZoom = 3.2;
var map = L.map('map', {zoomControl: false, zoomSnap: 0}).setView([mainMapCoordinates.x,mainMapCoordinates.y], 1);
var geojson;
geojson = L.geoJson(countryData, {
    onEachFeature: onEachFeature,
    style: style
}).addTo(map);

initializeLayerStates();

//popuate countries with language data
for(var language in languageData.languages){
    languageList.push(language);
    var currentLanguageData = languageData.languages[language];
    var lCountries = currentLanguageData.countries;
    var featGroup = [];
    for(var country in currentLanguageData.countries){
        var currentCountry = lCountries[country];
        for(var country in countryData.features){
            currentCountryData = countryData.features[country].properties;
            if(currentCountryData.name_long == currentCountry){
                currentCountryData.languages.push(language);
                //featGroup.push(countryData.features[country].geometry);
            }
        }
   } 
}

backToCountryMap.onclick = function(){openMap("country")};
closeTopUiButton.onclick = closeTopUiTo;
switchList.onclick = function(){changeListMode()};
mapToListButton.onclick = function(){openListPage(mapMode)};
infoButton.onclick = function(){openInfoPage()};
contactUs.onclick = function(){openContactPage()};
changeMapButton.onclick = function(){switchMapMode()};
backToLanguageMap.onclick = function(){openMap("language")};
welcomePage.onclick = function(){closeWelcomePage()};
tickets.onclick = function(){window.open("https://docs.google.com/document/d/1f-TydDXPLXDVi-X5PD98kBK73nvFInioeL-r_OIGNDY/edit?usp=sharing")};
toPage1.onclick = function(){openLanguagePageNum(0)};
toPage2.onclick = function(){openLanguagePageNum(1)};
toPage3.onclick = function(){openLanguagePageNum(2)};
playAudioButton.onclick = function(){playLanguageAudio()};


//click debouncing
function pageTransition(destination){
    //this.currentState = "transition";
    //setTimeout(() => {
        this.currentState = destination;
        resetGeoStyles();
    //}, 10);
}

function openMap(mode){
    try{
        if(mode != null){
            mapMode = mode;
        }
    }catch(error){}
    topUi.style.opacity = 1;
    topUi.style.pointerEvents = 'all';
    var long = mapMode == "country" ? mainMapCoordinates.y : -5;
    map.flyTo([mainMapCoordinates.x,long], mainMapZoom);

    resetLayerStates();
    pageTransition("countryMap");
    countryUi.style.opacity = mapMode == "country" ? 1 : 0;
    languageUi.style.opacity = mapMode == "language" ? 1 : 0;
    closeCountryPageToMap();
    closeLanguagePageToMap();
    languageUi.style.pointerEvents = mapMode == "language" ? 'all' : 'none';
    countryUi.style.pointerEvents = mapMode == "country" ? 'all' : 'none';
    changeMapButton.style.left = mapMode == "country" ? '500px' : '0px';
    var text = mapMode == "country" ? "Language" : "Country";
    changeMapButton.innerHTML = "Change to " + text + " Map";
     mouseExitCountry();
}

function setText(p, text){
    if( currentState !== "countryMap"){
        return;
    }
    p.innerHTML = text;
}

function createButtons(btnList, cssclass, data, parent, startTop, topInterval, click){
    for(var ind in data){
        var btn = document.createElement("BUTTON");
        parent.appendChild(btn);
        btn.className = cssclass;
        btn.style.top = (startTop + topInterval * ind) + 'px';
        var text = data[ind];
        btn.innerHTML = text;
        btn.onclick = click;
        btnList.push(btn);
    }
}

function createButtonRows(btnList, cssclass, data, parent, startTop, topInterval, startLeft, leftInterval, numColumn, click){
    var x = 0;
    var y = 0;
    for(var ind in data){
        var btn = document.createElement("BUTTON");
        parent.appendChild(btn);
        btn.className = cssclass;
        btn.style.top = (startTop + topInterval * y) + 'px';
        btn.style.left = (startLeft + leftInterval * x) + 'px';
        var text = data[ind];
        btn.innerHTML = text;
        btn.onclick = click;
        btnList.push(btn);
        y += 1;
        if(y >= numColumn){
            y = 0;
            x += 1;
        }
    }
}

function destroyButtons(btnList){
    for(var i = 0; i < btnList.length; i++){
        btnList[i].remove();
    }
    btnList = [];
}

//leaflet map style
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'pk.eyJ1IjoicGpzdGVmYW4iLCJhIjoiY2puZ2JlZTlhMDFlNzNvbzAwNmRwNDhlOCJ9.ZYsixdWrsUwZ9wwYifvdgQ'
// }).addTo(map);

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
}).addTo(map);

//disable standard map interactivity
map.touchZoom.disable();
map.dragging.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.doubleClickZoom.disable();
map.keyboard.disable();