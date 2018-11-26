function closeWelcomePage(){
	welcomePage.style.opacity = 0;
	welcomePage.style.pointerEvents = 'none';
	map.flyTo([mainMapCoordinates.x,mainMapCoordinates.y], 3.3);
}