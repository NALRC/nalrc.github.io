
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
	topUiMode = "list";
	listUi.style.opacity = 1;
	listUi.style.pointerEvents = 'all';
	var currentList = listMode == "country" ? countryList : languageList;
	currentList.sort();
	listMode == "country" ? 
		createButtonRows(listButtons, 'countryListButton', currentList, listUi, 80, 24, 6, 230, 17, closeTopUiTo):
		createButtonRows(listButtons, 'languageListButton', currentList, listUi, 80, 24, 4, 140, 17, closeTopUiTo);
	var text = listMode == "country" ? "Language" : "Country";
	switchListButton.innerHTML = "To " + text + " List";
	text = listMode == "country" ? "Countries" : "Languages";
	topUiTitle.innerHTML = "List of " + text;
	for(b in listButtons){
		listButtons[b].onmouseenter = listButtonMouseOver;
		listButtons[b].onmouseleave = listButtonMouseExit;
	}
	openTopUi();
}

function closeListPage(){
	listUi.style.opacity = 0;
	listUi.style.pointerEvents = 'none';
	listMouseOverName = "";
	destroyButtons(listButtons)
	listButtons = [];
	closeTopUi();
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
	console.log(mode)
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