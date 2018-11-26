
var listButtons = [];
var listMouseOverName = "";
var listMode = "country";

function openListPage(mode){
	try{
		if (mode != null){
			listMode = mode;
		}
	}catch(error){}
	pageTransition("list");
	map.flyTo([mainMapCoordinates.x,20], 3.3);
	listUi.style.opacity = 1;
	listUi.style.pointerEvents = 'all';
	var currentList = listMode == "country" ? countryList : languageList;
	currentList.sort();
	listMode == "country" ? 
		createButtonRows(listButtons, 'countryListButton', currentList, listUi, 80, 24, 6, 230, 17, closeListTo):
		createButtonRows(listButtons, 'languageListButton', currentList, listUi, 80, 24, 4, 140, 17, closeListTo);
	var text = listMode == "country" ? "Language" : "Country";
	switchListButton.innerHTML = "To " + text + " List";
	text = listMode == "country" ? "Countries" : "Languages";
	listUiTitle.innerHTML = "List of " + text;
	for(b in listButtons){
		listButtons[b].onmouseenter = listButtonMouseOver;
		listButtons[b].onmouseleave = listButtonMouseExit;
	}
}

function closeListPage(){
	listUi.style.opacity = 0;
	listUi.style.pointerEvents = 'none';
	listMouseOverName = "";
	destroyButtons(listButtons)
	listButtons = [];
}

function closeListTo(event){
	var name = event.target.innerHTML;
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

function listButtonMouseOver(event){
	listMouseOverName = event.target.innerHTML;
	resetGeoStyles();
}

function listButtonMouseExit(){
	listMouseOverName = "";
	resetGeoStyles();
}

function changeListMode(mode){
	if(listMode == "country"){
		listMode = "language";
	}else{
		listMode = "country";
	}
	try{
		if (mode != null){
			listMode = mode;
		}
	}catch(error){}
	destroyButtons(listButtons);
	listButtons = [];
	openListPage();
}