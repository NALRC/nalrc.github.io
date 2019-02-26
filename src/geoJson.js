//geojson mouse events
function mouseEnterCountry(e, feature){
    //console.log("entered " + e.target.feature.properties.name)
    if(currentState == "countryMap"){
        e.target.feature.properties.isMouseOver = true;
        if(mapMode == "country"){
            setText(currentCountryNameText, e.target.feature.properties.name_long);
            setText(currentCountryLanguagesText, formatLanguagesList(e.target.feature.properties.languages));
        }else{    
            setCurrentLanguageMap(e.target.feature.properties.languages);
        }
        resetGeoStyles();
    }
}

function formatLanguagesList(list){
    var langList = "";
    for(var l in list){
        langList += list[l] + ',  ';
    }
    return langList.slice(0,langList.length - 3);
}

function mouseExitCountry(e, feature){
    //console.log("exited " + e.target.feature.properties.name)
    if(currentState == "countryMap"){
        try{e.target.feature.properties.isMouseOver = false;}catch(e){};
        currentLanguage = "";
        setText(currentCountryNameText, "");
        setText(currentCountryLanguagesText, "");
        languageName.innerHTML = "";
        resetGeoStyles();
    }
}

function clickCountry(e, feature) {
    mapMode == "country" ? openToCountryFromMap(e.target.feature) : openLanguagePage(languageName.innerHTML);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mouseEnterCountry,
        mouseout: mouseExitCountry,
        click: clickCountry
    });
}

function initializeLayerStates(){
    geojson.eachLayer((geo) =>{
        var props = geo.feature.properties;
        props.isMouseOver = false;
        props.isSelected = false;
        props.languages = [];
        countryList.push(props.name_long);
    });
}

function resetLayerStates(){
    geojson.eachLayer((geo) =>{
        var props = geo.feature.properties;
        props.isMouseOver = false;
        props.isSelected = false;
    });
}

//rules for styling of geojson shapes
function style(feature) {
    var color = pickFillColor(feature);
    return {
        fillColor: color.color,
        weight: 2,
        opacity: 1,
        color: '#91008d',
        fillOpacity: color.opacity
    };
}

function pickFillColor(feature){
    var color;
    var opacity = .8;
    var name = feature.properties.name_long;
    var langData = languageData.languages;
    switch(currentState){
        case "countryMap":
            color = feature.properties.isMouseOver ? '#a9c9fc' : '#ffec63';
            opacity = feature.properties.isMouseOver ? 1 : 0;
            if(mapMode == "language"){
                try{
                    color = langData[languageName.innerHTML].countries.includes(name) ? '#a9c9fc' : '#ffec63';
                    opacity = langData[languageName.innerHTML].countries.includes(name) ? 1 : 0;
                }catch(e){}
            }
            break;
        case "countryPage":
            color = name == currentCountry ? '#a9c9fc' : '#b5b5b5';
            opacity = name == currentCountry ? 1 : 0;
            break;
        case "languagePage":
            color = langData[currentLanguage].countries.includes(name) ? '#0c00ff' : '#b5b5b5';
            opacity = langData[currentLanguage].countries.includes(name) ? 1 : 0;
            break;
        case "topUi":
            if(listMode == "country"){
                color = name == listMouseOverName ? '#db2e64' : '#ffffff';
                opacity = name == listMouseOverName ? 1 : 0;
            }else{
                try{
                    color = langData[listMouseOverName].countries.includes(name) ? '#db2e64' : '#ffffff';
                    opacity = langData[listMouseOverName].countries.includes(name) ? 1 : 0}
                catch(error){
                    color = '#ffffff';
                    opacity = 0;}
            }
            break;
    }
    var info = {'color': color, 'opacity': opacity};
    return info;
}

function resetGeoStyles(){
    geojson.eachLayer((geo) =>{
        geojson.resetStyle(geo);
    });
}

