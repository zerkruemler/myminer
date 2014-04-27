function Level(){
	// Level helper functions
	// The level is is a imageData object
	
	var levelImage=undefined;
	var blocksize=undefined;
	var levelSize={
			x:36*2,
			y:24
	};
	var levelData=[];
	var water=[];
	var ends=[];
			

	
	this.reset = function() {
		
	};
	
	this.getLevelSize = function() {
		return levelSize;
	};
	
	this.getStartPoint = function() {
		return {
			x:levelSize.x/2+1,
			y:7,
		};
	};
	
	this.addLevelImage = function(imageData,blocksizeIn){
		levelImage=imageData;
		blocksize=blocksizeIn;
	};
	
	this.createLevel = function() {
		
		// LevelData
		for (var levelY = 0; levelY < levelSize.y+1; levelY++) {
			levelData.push([]);
			for (var levelX = 0; levelX < levelSize.x; levelX++) {
				levelData[levelY][levelX]=1;
			}
		}
		// Add main funnel
		for (var yBlock = this.getStartPoint().y; yBlock < levelSize.y; yBlock++) {
			this.setTunnel(levelSize.x/2+1,yBlock);
		}
	};

	this.drawLevelImage = function() {
		// Background
		var base=0;
		var ypercent=0;
		for (var yPos = 0; yPos < levelImage.height*levelImage.width*4; yPos+=levelImage.width*4) {
			ypercent=yPos/(levelImage.height*levelImage.width*4)*255;
			for (var xPos = 0; xPos < levelImage.width*4; xPos+=4) {
				base=xPos+yPos;
				if(yPos>(levelImage.height-blocksize)*levelImage.width*4){
					// Ground level
					levelImage.data[base+0]=100;
					levelImage.data[base+1]=20;
					levelImage.data[base+2]=20;
					levelImage.data[base+3]=255;
				}else{
					levelImage.data[base+0]=255-ypercent/4;
					levelImage.data[base+1]=255-ypercent;
					levelImage.data[base+2]=40;
					levelImage.data[base+3]=255;
				}
			}
				
		}
		
		// Left and right limitation
		
		var drawLimit = function(xStart) {
			for (var yPos = 0; yPos < levelImage.height; yPos++) {
				this.colorAt(xStart+0,yPos,'0050f0');
				this.colorAt(xStart+1,yPos,'1060f0');
				this.colorAt(xStart+2,yPos,'2070f0');
				this.colorAt(xStart+3,yPos,'3080f0');
				this.colorAt(xStart+4,yPos,'4090f0');
				this.colorAt(xStart+5,yPos,'3080f0');
				this.colorAt(xStart+6,yPos,'2070f0');
				this.colorAt(xStart+7,yPos,'1060f0');
				this.colorAt(xStart+8,yPos,'0050f0');
			}
		};
		drawLimit.call(this,4);
		drawLimit.call(this,levelImage.width-14);
		
		for (var yPos = 0; yPos < levelImage.height; yPos++) {
			this.colorAt(yPos,yPos,'00ff00');
		}		

//		for (var yBlock = this.getStartPoint().y; yBlock < levelSize.y; yBlock++) {
//			this.setTunnel(levelSize.x/2+1,yBlock);
//			
//		}
	};
	
	this.addCollectibleObjects = function(ammount){
		// Adds some collectible objects to the game field
		// The objects are marked like this:
		// A= Single object
		// B/C = Object which is two fields wide
		// D
		// E = Object which is two fields high
		// F/G
		// H/I = Object which is four fields big
		var leftRight=0;
		for (var objectNumber = 0; objectNumber < ammount; objectNumber++) {
			// First get a position
			do{
				posX=Math.floor(Math.random()*(levelSize.x/2-6))+3;
				Math.random();
				posY=Math.floor(Math.random()*(levelSize.y-9))+7;
				type=Math.floor(Math.random()*4);
				// Distribute the objects evenly to left and right
				posX+=leftRight*levelSize.x/2;
				// Check if set is possible
			}while((this.setPossible(posX,posY)===false));
			leftRight=1-leftRight;
			// Now set them
			this.setObject(posX,posY,type);
		};
	};
	
	this.setPossible = function(posX,posY) {
		if(this.levelTile(posX,posY)!==1){
			return false;
		}
		var around=this.getFreeAround(posX, posY,1);
		if(around.length!==4){
			return false;
		}
		return true;
	};
	
	this.setObject = function(x,y,type) {
		// shows the object at the position
	
		switch (type) {
		case 0:
			this.copyImage(x,y,'A');
			levelData[y][x]='A';
			break;
		case 1:
			this.copyImage(x,y,'B');
			levelData[y][x]='B';
			this.copyImage(x+1,y,'C');
			levelData[y][x+1]='C';
			break;
		case 2:
			this.copyImage(x,y,'D');
			levelData[y][x]='D';
			this.copyImage(x,y+1,'E');
			levelData[y+1][x]='E';
			break;
		case 3:
			this.copyImage(x,y,'F');
			levelData[y][x]='F';
			this.copyImage(x+1,y,'G');
			levelData[y][x+1]='G';
			this.copyImage(x,y+1,'H');
			levelData[y+1][x]='H';
			this.copyImage(x+1,y+1,'I');
			levelData[y+1][x+1]='I';
			break;
		default:
			break;
		}
	};

	this.copyImage = function(x,y,number) {
		var startX=x*blocksize;
		var startY=y*blocksize;
		for (var addX = 0; addX < blocksize; addX++) {
			for (var addY = 0; addY < blocksize; addY++) {
				this.colorAt(startX+addX,startY+addY,'40FF40');
			}
		}
	};
	
	this.rgbColorAt = function(x,y,r,g,b){
		pos=(y*levelImage.width+x)*4;
		levelImage.data[pos+0]=r;
		levelImage.data[pos+1]=g;
		levelImage.data[pos+2]=b;
		levelImage.data[pos+3]=255;
	};
	this.colorAt = function(x,y,color){
		pos=(y*levelImage.width+x)*4;
		levelImage.data[pos+0]=parseInt(color.substring(0,2),16);
		levelImage.data[pos+1]=parseInt(color.substring(2,4),16);
		levelImage.data[pos+2]=parseInt(color.substring(4,6),16);
		levelImage.data[pos+3]=255;
	};
	
	this.setTunnel = function(x,y){
		// sets a tunnelpart according to the blocksize
		var startX=x*blocksize;
		var startY=y*blocksize;
		for (var addX = 0; addX < blocksize; addX++) {
			for (var addY = 0; addY < blocksize; addY++) {
				this.colorAt(startX+addX,startY+addY,'000000');
			}
		}
		levelData[y][x]=0;
	};
	this.setRock = function(x,y){
		// sets a tunnelpart according to the blocksize
		var startX=x*blocksize;
		var startY=y*blocksize;
		for (var addX = 0; addX < blocksize; addX++) {
			for (var addY = 0; addY < blocksize; addY++) {
				var ypercent=(startY+addY)/levelImage.height*255;
				this.rgbColorAt(startX+addX,startY+addY,255-ypercent/4,255-ypercent,40);
			}
		}
		levelData[y][x]=1;
	};

	this.setWater = function(x,y,flow){
		// shows some water at the position
		var startX=x*blocksize;
		var startY=y*blocksize;
		for (var addX = 0; addX < blocksize; addX++) {
			for (var addY = 0; addY < blocksize; addY++) {
				this.colorAt(startX+addX,startY+addY,'4040FF');
			}
		}
		levelData[y][x]=2;
	};
	
	
	// Water //
	this.getWater = function(){
		return water;
	};
	
	this.levelTile = function(x,y){
		// Field is free
		return levelData[y][x];
	};

	this.initWater = function(x,y) {
		if(this.levelTile(x,y)===0){
			water.push({x:x,y:y});
			ends.push({x:x,y:y});
			this.setWater(x,y);
//			water.x=x;
//			water.y=y;
		}else{
			throw 'Tile not free';
		}
	};
	
	this.getFreeAround = function(x,y,tile) {
		if(tile===undefined){
			tile=0;
		}
		// Get the tiles around this one which are free
		around=[];
		var $this=this;
		
		var checkFree = function (xTo,yTo) {
			if($this.levelTile(x+xTo,y+yTo)===tile){
				var isUp=false;
				if(yTo===-1){
					isUp=true;
				}
				around.push({
					x:x+xTo,
					y:y+yTo,
					up:isUp});
			}
		};
		checkFree(-1,0); // Left
		checkFree( 1,0); // Right
		checkFree(0, 1); // down
		checkFree(0,-1); // up
		return around;
	};
	
	this.flow = function(){
		var endLength=ends.length;
		var flown=false; // any field has flown
		var newEnds=[];
		for (var endNumber = 0; endNumber < endLength; endNumber++) {
			var end = ends[endNumber];
			var frees = this.getFreeAround(end.x,end.y);
			for (var freeNumber = 0; freeNumber < frees.length; freeNumber++) {
				var newPos={
						x:frees[freeNumber].x,
						y:frees[freeNumber].y						
				};
				if(frees[freeNumber].up===true&&flown===true){
					// flow not up when it was flown elsewhere
					newPos.y+=1;
					newEnds.push(newPos);
					continue;
				}
				this.setWater(newPos.x,newPos.y);
				water.push(newPos);
				flown=true;
				newEnds.push(newPos);
			}
		}
		ends=newEnds;
	};
}