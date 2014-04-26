function GameModel() {
	
	var uiRedraw=false;
	var oldTime=undefined;
	var timedifference=undefined;
	var $this=this;
	var xPos=0; // Position of the playfield
	var direction=c.DIRECTION.STOP;
	var currentDirection=c.DIRECTION.STOP;
	var playerPos={
			x:0,
			y:0,
			xFine:0,
			yFine:0,
			fine:0,
	};
	var screenSize={
			x:36,
			y:24
	};
	var level = undefined;


	
	this.reset = function(){
        oldTime=this.getTime();
    	uiRedraw=true;
    	events.startLevel.notify();
    	direction=c.DIRECTION.STOP;
    	currentDirection=c.DIRECTION.STOP;
	};
	
	this.setLevel = function(levelIn){
		level=levelIn;
	};
	
	this.getTime = function() {
		return new Date();
	};
	
	var events={
		buttonSelection : new Event(),
		startLevel 		: new Event(),
		game 			: new Event(),
		key             : new Event(),
		walk			: new Event(),
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
	
	this.keyPressed = function(key){
		events.key.notify(key);
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
	
	this.getXPos = function() {
		return xPos;
	};
	this.setXPos = function(xPosIn) {
		xPos=xPosIn;
	};
	this.getScreenSize = function() {
		return screenSize;
	};

	this.registerEvent('key', function(key) {
		// Direction changed
		if(key!==c.DIRECTION.BUTTON){
			direction=key;
		}
	});
	
	// Player movement //
	this.movePlayer= function() {
		// Moves the player according to the direction
		var xTo=0;
		var yTo=0;
		if(playerPos.fine==0 ){
			// Turning just possible on center of fields
			var offset=getOffset(direction);
			if(checkDirectionPossible(playerPos,offset)){
				currentDirection=direction;
				if(direction!==c.DIRECTION.STOP){
					event.walk.notify(1); // Start walking (for sound)
				}
			}else{
				currentDirection=c.DIRECTION.STOP;
				event.walk.notify(0);  // Stop walking (for sound)
			}
			direction=c.DIRECTION.STOP;
		}
		var offset=getOffset(currentDirection);
		xTo=offset.x;
		yTo=offset.y;
			
		if(currentDirection!=c.DIRECTION.STOP){
			// Move the player further
			playerPos.fine++;
			if(playerPos.fine>c.PLAYER.SPEED){
				playerPos.fine=0;
				playerPos.x+=xTo;
				playerPos.y+=yTo;
			}
		}
		playerPos.xFine=playerPos.x+xTo*playerPos.fine/c.PLAYER.SPEED;
		playerPos.yFine=playerPos.y+yTo*playerPos.fine/c.PLAYER.SPEED;
		return direction;
		
	};
	var getOffset = function(direction){
		var xTo=0;
		var yTo=0;
		switch(direction){
		case c.DIRECTION.UP:
			xTo=0;
			yTo=-1;
			break;
		case c.DIRECTION.DOWN:
			xTo=0;
			yTo=1;
			break;
		case c.DIRECTION.LEFT:
			xTo=-1;
			yTo=0;
			break;
		case c.DIRECTION.RIGHT:
			xTo=1;
			yTo=0;
			break;

		default:
			break;
		}
		return {
			x:xTo,
			y:yTo};
	};
	
	var checkDirectionPossible = function(playerPos,to){

		var levelSize = level.getLevelSize();
		if(playerPos.x<2 || playerPos.x>levelSize.x-2 ||
		   playerPos.y<7 || playerPos.y>levelSize.y-2	){
			return false;
		}
		return true;
	};
	

}