function GameView() {
	
	// All coordinates are given in relative form to a virtual screen size of 40*25 (16:10)
	// Text is scaled to the height of 1 including spacing between the lines for normal text (25 Lines) 
	// and the double size for headings
	
	var context=undefined;
	var contextBackground=undefined;
	var contextFlower=undefined;
	var contextUi=undefined;
	var canvas=undefined;
	var gameModel=undefined;
	var contextSize={}; 
	var blocksize=1;
	var removed=false;
	var ui={};
	var buttonsUi=undefined;
	var backgroundUi=undefined;
	var buttonsUi=undefined;
	var ySize=0;
	

	var $this=this;
	
	this.reset = function(gameModelImport,canvasArea){
		gameModel=gameModelImport;
		contextBackground=canvasArea.getContextBackground();
		contextUi=canvasArea.getContextUi();

		canvas=canvasArea;
		this.resize(canvasArea.getSize());
		$this=this;
	};
	this.layerBackground = function() {
		context=contextBackground;
	};

	this.addUi = function(uiName,uiObject){
		// Adds an ui to the view
		ui[uiName]=uiObject;
	};
	
	this.layerUi = function() {
		context=contextUi;
	};
	this.addBackgroundUi = function(backgroundUiIn){
		backgroundUi=backgroundUiIn;
	};
	
	this.resize = function(newSize){
		blocksize = Math.min(newSize.x/30|0,newSize.y/25|0); // |0  = integer value of value make sure blocksize is integer
		contextSize.x = blocksize*30;    
		contextSize.y = blocksize*25;
		hexSize=blocksize;
		hexHeight= Math.sqrt(3)/2 * hexSize;
		ySize=25;
	};

	this.registerMouse = function(buttonsUiIn){
		buttonsUi = buttonsUiIn;
		canvas.addEventListener('touchstart',checkTouch);
		canvas.addEventListener('mousedown',checkClick);
		canvas.addEventListener('touchmove',moveAround);
		canvas.addEventListener('mousemove',moveAround);
		canvas.addEventListener('touchend',moveEnd);
		canvas.addEventListener('mouseup',moveEnd);
	};
	
	function checkTouch(event){
		// remove click events
		if(removed===false){
			canvas.removeEventListener('mousedown',checkClick);
			canvas.removeEventListener('mousemove',moveAround);
			canvas.removeEventListener('mouseup',moveEnd);
			removed=true;
		}
		event.preventDefault();
		checkClick(event);
	}	

	function checkClick(event){
		var mouse=new Mouse(event);
		var button = buttonsUi.checkClicked(mouse);
		if(button){
			gameModel.buttonClicked(button);
			return;
		};
		// Check other UI elements for a click event
	};
    
    function moveAround(event){
//		var mouse=new Mouse(event);
    };
    function moveEnd(event){
    }
    
	this.getYSize = function() {
		return ySize;
	};
	
	this.clearBackground = function(){
		canvas.clearBackground();
	};
	this.clear = function(){
		canvas.clearScreen();
	};

	this.setFill = function(color){
		context.fillStyle = color;
	};
	this.setStroke = function(color){
		context.strokeStyle = color;
	};
//	this.setColors = function(colors){
//		if(colors.fill){
//			context.fillStyle = colors.fill;
//		};
//		if(colors.stroke){
//			context.strokeStyle = colors.stroke;
//		};
//	};
	
	this.setLineWidth = function(value) {
		context.lineWidth = value;
	};
	
	this.setLineCap = function(value) {
		context.lineCap = value;
	};

	this.fillRect = function(x,y,xs,ys){
		context.fillRect(
				x*blocksize,
				y*blocksize,
				xs*blocksize-1,
				ys*blocksize-1);
	};

	this.dot = function(x,y){
		context.fillRect(
				x*blocksize,
				y*blocksize,
				1,
				1);
	};
	
	this.strokeRect = function(x,y,xs,ys,lineWidth){
		if(lineWidth===undefined){
			lineWidth=1;
		}
		context.lineWidth = lineWidth;
		context.strokeRect(
				x*blocksize,
				y*blocksize,
				xs*blocksize-1,
				ys*blocksize-1);
	};
	this.beginPath = function() {
		context.beginPath();
	};
	
	this.moveTo = function(x,y){
	    context.moveTo(x*blocksize, y*blocksize);
	};

	this.lineTo = function(x,y){
	    context.lineTo(x*blocksize, y*blocksize);
	};
	
	this.beginPath = function(){
	    context.beginPath();
	};
	this.stroke = function(){
	    context.stroke();
	};
	this.fill = function(){
	    context.fill();
	};
	
	this.text = function(textData){
		textData.x*=blocksize;
		textData.y*=blocksize;
		var size=textData.size || 1;
		var textSize=Math.floor(blocksize*0.8);
		var alpha=textData.alpha || 1;
		var outline=textData.outline || 0;
		var bold = textData.bold || 'bold ';
		textSize*=size;
		if(textData.color!==undefined){
			this.circularGradient(textData.x/blocksize, textData.y/blocksize,size*3,textData.color,textData.color2 || '0,0,64');
		}else{
			context.fillStyle=c.color.text;
		}
		context.strokeStyle=c.color.textOutline;
        context.font = bold+ textSize +'px sans-serif ';
//        stage.font = "20px Verdana";
        context.textBaseline = 'top';
        if(alpha!==1){
        	context.globalAlpha=alpha;
        }
        if(textData.center){
        	context.textAlign = 'center';
        }else{
        	context.textAlign = 'start';
		};
		if(outline>0){
			context.lineWidth=size+outline;
			context.strokeText(textData.text,textData.x,textData.y);
		}
		context.fillText(textData.text,textData.x,textData.y);
    	context.globalAlpha=1;
	};
	
	this.drawButtons = function(){
		ui.buttons.drawAll();
	};
	
	this.checkButtonClicked = function(button,mouse){
		// Helper called from ButtonsUi
        var x=button.x*blocksize;
        var y=button.y*blocksize;
        var sx=button.sx*blocksize; // sizex
        var sy=button.sy*blocksize; // sizey
        if (mouse.x < x || mouse.x > x+sx || mouse.y < y || mouse.y > y+sy) {
            // button not hit
            return false;
        } else {
            // Hit
            return true;
        }
    };
    
}
