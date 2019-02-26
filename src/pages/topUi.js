var topUiMode;


function closeMapUi(){
	topUi.style.opacity = 0;
	topUi.style.pointerEvents = 'none';
}

function openContactPage(){
	topUiMode = "contact";
	topUiTitle.innerHTML = "Contact Us";
	topUiBody.innerHTML = otherContent.contactUs;
	topUiBody.style.opacity = 1;
	openTopUi();
}

function openInfoPage(){
	topUiMode = "info";
	topUiTitle.innerHTML = "About / Credits";
	topUiBody.innerHTML = otherContent.creditInfo;
	topUiBody.style.opacity = 1;
	openTopUi();
}

function openTopUi(){
	map.flyTo([mainMapCoordinates.x - 3,20], 3.3);
	pageTransition("topUi");
	topUi.style.height = '500px';
	for(b in topUiButtons){
		var style = topUiButtons[b].style;
		style.opacity = 0;
		style.pointerEvents = 'none';
	}
	closeTopUiButton.style.opacity = 1;
	closeTopUiButton.style.pointerEvents = 'all';
	topUiTitle.style.opacity = 1;
	slideCloseCountryPage();
	closeLanguagePage();
}

function closeTopUi(){
	topUi.style.height = '45px';
	for(b in topUiButtons){
		var style = topUiButtons[b].style;
		style.opacity = 1;
		style.pointerEvents = 'all';
	}
	closeTopUiButton.style.opacity = 0;
	closeTopUiButton.style.pointerEvents = 'none';
    topUiTitle.style.opacity = 0;
    topUiBody.style.opacity = 0;
}

function switchMapMode(){
	mapMode = mapMode == "country" ? "language" : "country";
	openMap();
}

function closeTopUiTo(event){
	var name = event.target.innerHTML;
	if(topUiMode == "list"){
		switch(name){
			case "x":
				openMap(listMode);
				break;
			default:
				listMode == "country" ? openCountryPage(event) : openLanguagePage(event);
				break;
		}
		closeListPage();
	}
	else{
		openMap(mapMode);
		closeTopUi();
	}
}