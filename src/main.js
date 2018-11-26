var currentState = "countryMap";
var currentCountryNameText = document.getElementById("mouseOverCountryName");
var currentCountryLanguagesText = document.getElementById("mouseOverCountryLanguages")
var countryUi = document.getElementById("countryUi");
var countryToListButton = document.getElementById("mapToListButton");
var backToCountryMap = document.getElementById("backToCountryMap");
var languageUi = document.getElementById("languageUi");
var languageName = document.getElementById("languageName");
var backToLanguageMap = document.getElementById("backToLanguageMap");
var languageToListButton = document.getElementById("languageToListButton")
var brochureButton = document.getElementById("brochure");
var listUi = document.getElementById("listUi");
var closeList = document.getElementById("closeList");
var switchListButton = document.getElementById("switchList");
var listUiTitle = document.getElementById("listTitle");
var changeMapButton = document.getElementById("changeMapButton");
var welcomePage = document.getElementById("welcomePage");
var startButton = document.getElementById("startButton");
var tickets = document.getElementById("tickets");

var countryList = [];
var languageList = [];

var languageCountryGroups = [];

var mainMapCoordinates = L.point(1, 38);
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
countryToListButton.onclick = function(){countryToList()};
closeList.onclick = closeListTo;
switchList.onclick = function(){changeListMode()};
languageToListButton.onclick = function(){languageToList()};
changeMapButton.onclick = function(){switchMapMode()};
backToLanguageMap.onclick = function(){openMap("language")};
welcomePage.onclick = function(){closeWelcomePage()};
tickets.onclick = function(){window.open("https://docs.google.com/document/d/1f-TydDXPLXDVi-X5PD98kBK73nvFInioeL-r_OIGNDY/edit?usp=sharing")};

//click debouncing
function pageTransition(destination){
    this.currentState = "transition";
    setTimeout(() => {
        this.currentState = destination;
        resetGeoStyles();
    }, 10);
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