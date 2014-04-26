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
		var base=0;
		var ypercent=0;
		
		// LevelData
		for (var levelY = 0; levelY < levelSize.y; levelY++) {
			levelData.push("");
			for (var levelX = 0; levelX < levelSize.x; levelX++) {
				levelData[levelY][levelX]=1;
			}
		}
		
		// Background
		for (var yPos = 0; yPos < levelImage.height*levelImage.width*4; yPos+=levelImage.width*4) {
			ypercent=yPos/(levelImage.height*levelImage.width*4)*255;
			for (var xPos = 0; xPos < levelImage.width*4; xPos+=4) {
				base=xPos+yPos;
				levelImage.data[base+0]=255-ypercent/4;
				levelImage.data[base+1]=255-ypercent;
				levelImage.data[base+2]=40;
				levelImage.data[base+3]=255;
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

		for (var yBlock = this.getStartPoint().y; yBlock < levelSize.y; yBlock++) {
			this.setTunnel(levelSize.x/2+1,yBlock);
			
		}
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
}