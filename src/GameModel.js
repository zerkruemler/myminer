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

	this.startLevel = function(){
		
		this.resetPlayerPos();
		this.clearEvents('key');
		this.clearEvents('keyUp');
		direction=c.DIRECTION.STOP;
		this.registerEvent('key', function(key) {
			// Direction changed
			if(key!==c.DIRECTION.BUTTON){
				direction=key;
			}
		});
		this.registerEvent('keyUp', function(key) {
			// Key up, stop player, when the same key was lifted, which was pushed
			if(key===direction){
				direction=c.DIRECTION.STOP;
			}
		});
	};
	
	this.getTime = function() {
		return new Date();
	};
	
	var events={
		buttonSelection : new Event(),
		startLevel 		: new Event(),
		game 			: new Event(),
		key             : new Event(),
		keyUp           : new Event(),
		walk			: new Event(),
		drowned			: new Event(),
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
	this.clearEvents = function(name){
		events[name].clearAll();
	};

	this.buttonClicked = function(button){
		events.buttonSelection.notify(button.id);
	};
	
	this.keyPressed = function(key,down){
		if(down===true){
			events.key.notify(key);
		}else{
			events.keyUp.notify(key);
		}
	};
	
	this.resetPlayerPos = function() {
		playerPos.x=level.getStartPoint().x;
		playerPos.y=level.getStartPoint().y;
		playerPos.xFine=playerPos.x;
		playerPos.yFine=playerPos.y;
		xPos=playerPos.x/2*-1;
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
					events.walk.notify(1); // Start walking (for sound)
				}
			}else{
				currentDirection=c.DIRECTION.STOP;
				direction=currentDirection;
				events.walk.notify(0);  // Stop walking (for sound)
			}
// No auto stop			
//			direction=c.DIRECTION.STOP;
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
				if(level.levelTile(playerPos.x,playerPos.y)===2){
					// player drowned
					events.drowned.notify();
				}
				this.digTo(playerPos.x,playerPos.y);
			}
		}else{
			// Standing around
			if(level.levelTile(playerPos.x,playerPos.y)===2){
				// player drowned
				events.drowned.notify();
			}
		}
		playerPos.xFine=playerPos.x+xTo*playerPos.fine/c.PLAYER.SPEED;
		playerPos.yFine=playerPos.y+yTo*playerPos.fine/c.PLAYER.SPEED;
		
		// Scrolling
		// Right border
		if(xPos*-1+screenSize.x+-10<playerPos.xFine){
			xPos=(-screenSize.x+playerPos.xFine+10)*-1;
		}
		if(xPos*-1+10>playerPos.xFine){
			xPos=(playerPos.xFine-10)*-1;
		}
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

	this.digTo = function(xPos,yPos) {
		var erase = function(allTiles) {
			level.setTunnel(xPos,yPos);
			for (var tileNumber = 0; tileNumber < allTiles.length; tileNumber+=2) {
				// Set all other tiles to solid rock
				level.setRock(xPos+allTiles[tileNumber],yPos+allTiles[tileNumber+1]);
			}
		};
		// Check if something was collected
		var tile = level.levelTile(xPos,yPos);
		// A collectible, see which other fields need to be erased
		// A= Single object
		// B/C = Object which is two fields wide
		// D
		// E = Object which is two fields high
		// F/G
		// H/I = Object which is four fields big
		switch (tile) {
		case 1:  // Normal rock
			erase([]);
			break;
		case 'A':
			erase([]);
			break;
		case 'B':
			erase([1,0]);
			break;
		case 'C':
			erase([-1,0]);
			break;
		case 'D':
			erase([0,1]);
			break;
		case 'E':
			erase([0,-1]);
			break;
		case 'F':
			erase([1,0,0,1,1,1]);
			break;
		case 'G':
			erase([-1,0,0,1,-1,1]);
			break;
		case 'H':
			erase([1,0,0,-1,1,-1]);
			break;
		case 'I':
			erase([-1,0,0,-1,-1,-1]);
			break;

		default:
			break;
		}
		// Set the tunnel part
	};
	
	
	this.getPlayerPos = function() {
		return playerPos;
	};
	
	var checkDirectionPossible = function(playerPos,to){

		var levelSize = level.getLevelSize();
		if(playerPos.x<2 && to.x===-1 ||
		   playerPos.x>levelSize.x-3 && to.x===1 ||
		   playerPos.y<=7 && to.y===-1 ||
		   playerPos.y>levelSize.y-3 && to.y===1 ){
			return false;
		}
		return true;
	};
	

}