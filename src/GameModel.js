function GameModel() {
	
	var uiRedraw=false;
	var oldTime=undefined;
	var timedifference=undefined;
	var $this=this;

	
	this.reset = function(){
        oldTime=daystart.getTime();
    	uiRedraw=true;
    	events.startLevel.notify();
	};
	
	var events={
		buttonSelection : new Event(),
		startLevel 		: new Event(),
		game 			: new Event(),
	};
	
	this.loadLevel = function(levelNumber){
        level= levels.getLevel(levelNumber);
	};
	this.levelExists = function(levelNumber) {
		return levels.levelExists(levelNumber);
	};
	
	this.registerEvent = function(name,listener){
		events[name].attach(listener);
	};

	this.buttonClicked = function(button){
		events.buttonSelection.notify(button.id);
	};
	
	// Cheat functions
	this.cheat = function(name) {
		switch (name) {
		case 'fast':
			break;
		case 'fastAnim':
			break;
		default:
			break;
		}
	};
	
	this.uiRedrawNeeded = function() {
		util.buttons.requireRedraw();
		uiRedraw=true;
	};
	this.isUiRedrawNeeded = function() {
		var redraw=uiRedraw;
		uiRedraw=false;
		return redraw;
	};
	
	this.getLevel = function() {
		return level;
	};

}