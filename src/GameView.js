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
	var flowerUi=undefined;
	var gaugesUi=undefined;
	var optionsUi=undefined;
	var options=undefined;
	var animalsUi=undefined;
	var helpTextsUi=undefined;
	var ySize=0;
	
	// Hexagon sizes
	var hexSize=blocksize;
	var hexHeight=1;

	var hover={x:0,y:0};
	var origin={x:15,y:17};
	var $this=this;
	
	this.reset = function(gameModelImport,canvasArea){
		gameModel=gameModelImport;
		contextBackground=canvasArea.getContextBackground();
		contextFlower=canvasArea.getContext();
		contextAnimals=canvasArea.getContextAnimals();
		contextUi=canvasArea.getContextUi();
		context=contextFlower;
		
		canvas=canvasArea;
		this.resize(canvasArea.getSize());
		$this=this;
	};
	this.layerBackground = function() {
		context=contextBackground;
	};
	this.layerFlower = function() {
		context=contextFlower;
	};
	this.layerAnimals = function() {
		context=contextAnimals;
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
	this.addFlowerUi = function(flowerUiIn){
		flowerUi=flowerUiIn;
	};
	this.addGaugesUi = function(gaugesUiIn){
		gaugesUi=gaugesUiIn;
	};
	this.addOptionsUi = function(optionsUiIn){
		optionsUi=optionsUiIn;
	};
	this.addAnimalsUi = function(animalsUiIn){
		animalsUi=animalsUiIn;
	};
	this.addHelpTextsUi = function(helpTextsUiIn){
		helpTextsUi=helpTextsUiIn;
	};
	
	
	this.resize = function(newSize){
		blocksize = Math.min(newSize.x/30|0,newSize.y/25|0); // |0  = integer value of value make sure blocksize is integer
		contextSize.x = blocksize*30;    
		contextSize.y = blocksize*25;
		hexSize=blocksize;
		hexHeight= Math.sqrt(3)/2 * hexSize;
		ySize=25;
		hex.setViewSizes(blocksize,hexHeight,hexSize,origin);
//		hexWidth = hexSize*2;
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
		// Check if plant was clicked
		var hex = $this.posToHex(clickPos(mouse));		
		gameModel.clickedAt(hex);
		options=gameModel.getOptions();
		// Check other UI elements for a click event
	};

    function clickPos(mouse){
		var clickPos={};
		clickPos.x=mouse.x/hexSize;
		clickPos.y=mouse.y/hexSize;
		return clickPos;
    }
    
    function moveAround(event){
		var mouse=new Mouse(event);
    	// Try to find out which hexagon was moved over
		hover.x=mouse.x/hexSize;
		hover.y=mouse.y/hexSize;
		if(gameModel.getHexClickPos!==undefined){
			gameModel.uiRedrawNeeded();
		}
    };
    function moveEnd(event){
    	var hexClickPos=gameModel.getHexClickPos();
    	if(hexClickPos===undefined || options === undefined){
    		return;  // Was not a valid pos
    	}
    	// Mouse button released
		var mouse=new Mouse(event);
    	// Check if one of the option fields are selected
		var hexPos = $this.posToHex(clickPos(mouse));		
    	var option = optionHit(hexClickPos,hexPos,options.root);
    	var selectable = optionSelectable(options,option);
    	if(gameModel.getRequirementFulfilled()===true && selectable>0){
    		if(option.substring(0,1)==='u'){
    			switch (selectable) {
				case 1:
	    			gameModel.growTo(option,options.root);
					break;
				case 2:
	    			gameModel.sprout();
					break;
				default:
					break;
				}
    		}
    		if(option==='d'){
    			// Add a leaf
    			gameModel.addLeaf();
    		}
    		if(option==='dl'){
    			switch (selectable) {
				case 1:
					// Add a bud
					gameModel.addLeaf('b');
					break;
				case 2:
					// Evolve to blossom
					gameModel.evolveBlossom();
					break;
				case 3:
					// Evolve to blossom
					gameModel.evolveBlossom();
					break;
				default:
					break;
				}
    		}
    	}
    	gameModel.clickedAt(undefined);
    	options=undefined;
    }
    
   function optionHit(optionsPos,clickPos,isRoot){
    	var difference={
    			r:clickPos.r-optionsPos.r,
    			q:clickPos.q-optionsPos.q,
    	};
    	var direction = hex.coordToDirection(difference);
    	if(isRoot===true){
    		direction = hex.flip(direction);
    	}
    	return direction;
    }
    
    function optionSelectable(options,option){
    	switch (option) {
		case 'ul': // Up left
			return options.gl;
			break;
		case 'u':  // Straight up 
			return options.gm;
			break;
		case 'ur':  // Up right
			return options.gr;
			break;
		case 'd':  // Add leaf
			return options.o2;
			break;
		case 'dl':  // Add blossom
			return options.o1;
			break;
		default:
			return false;
			break;
		}
    	return false;
    };
    
    this.showHoveredHexagon = function(){
    	if(hover.x>30){
    		return;
    	}
    	this.setColors({fill:c.color.options.borderSelected});
    	var hex = this.posToHex(hover);
    	this.drawHexagon(hex);
    };
    
    this.showOptions = function(){
		if(options!==undefined){
	    	var hexPos = gameModel.getHexClickPos();
	    	var hex = this.posToHex(hover);
	    	optionsUi.drawOptions(this,options,hexPos,hex);
		}
    	
    };
    
    this.posToHex = function(pos){
    	// TODO: Refactor
    	var y=(pos.x-origin.x)*hexSize+hexSize;
    	var x=(pos.y-origin.y)*hexSize+hexSize;
   		x = (x - hexHeight) / hexHeight/2;
   		var t1 = y / hexSize;
   		var t2 = Math.floor(x + t1);
    	var r = Math.floor((Math.floor(t1 - x) + t2) / 3); 
    	var q = Math.floor((Math.floor(2 * x + 1) + t2) / 3) - r;
    	return {
    		r:r,
    		q:q};
    		
    		
    	// Works somehow:
//    	var y=(pos.x-origin.x)*hexSize+hexSize;
//    	var x=(pos.y-origin.y)*hexSize+hexSize;
//   		x = (x - hexHeight) / hexHeight/2;
//   		var t1 = y / hexSize;
//   		var t2 = Math.floor(x + t1);
//    	var r = Math.floor((Math.floor(t1 - x) + t2) / 3); 
//    	var q = Math.floor((Math.floor(2 * x + 1) + t2) / 3) - r;
//    	return {
//    		r:r,
//    		q:q};
    };

    this.getOrigin=function(){
    	return origin;
	};
	this.getYSize = function() {
		return ySize;
	};
	
	this.clearBackground = function(){
		canvas.clearBackground();
	};
	this.clear = function(){
		canvas.clearScreen();
	};
	this.clearAnimals = function(){
		canvas.clearAnimals();
	};
	this.clearUi = function(){
		canvas.clearUi();
	};

	this.setColors = function(colors){
		if(colors.fill){
			context.fillStyle = colors.fill;
		};
		if(colors.stroke){
			context.strokeStyle = colors.stroke;
		};
	};
	
	this.circularGradient = function(x,y,radius,color1,color2) {
	    var rad = context.createRadialGradient(x*blocksize, y*blocksize, 1, x*blocksize, y*blocksize, radius*blocksize);
	    rad.addColorStop(0, 'rgb('+color1+')');
	    rad.addColorStop(1, 'rgb('+color2+')');
	    context.fillStyle = rad;					
	};
	
	this.circularGradientAlpha = function(x,y,radius,color1,color2) {
	    var rad = context.createRadialGradient(x*blocksize, y*blocksize, 1, x*blocksize, y*blocksize, radius*blocksize);
	    rad.addColorStop(0, 'rgba('+color1+')');
	    rad.addColorStop(1, 'rgba('+color2+')');
	    context.fillStyle = rad;					
	};
	this.linearGradient = function(x,y,xTo,yTo,color1,color2) {
		var linear = context.createLinearGradient((x-xTo/2)*blocksize, (y-yTo/2)*blocksize,(x+xTo/2)*blocksize,(y+yTo/2)*blocksize);
		linear.addColorStop(0,color1);
		linear.addColorStop(0.5,color2);
		linear.addColorStop(1,color1);
		context.fillStyle = linear;
		context.strokeStyle = linear;
	};
	
	this.setLineWidth = function(value) {
		context.lineWidth = value;
	};
	
	this.setLineCap = function(value) {
		context.lineCap = value;
	};

	this.alpha = function(value){
    	context.globalAlpha=value;
    };
    this.closePath = function() {
		context.closePath();
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
	this.bezierCurveTo = function(x1,y1,x2,y2,x3,y3){
	    context.bezierCurveTo(
	    		x1*blocksize,y1*blocksize,
	    		x2*blocksize,y2*blocksize,
	    		x3*blocksize,y3*blocksize);
	};
	

	this.circle = function(x,y,radius){
		context.beginPath();
	    context.arc(x*blocksize, y*blocksize, radius*blocksize, 0, 2 * Math.PI, false);
	    context.fill();
        context.closePath();
	};
	
	this.drawHexagon = function(hexPos,filled){
		// Coordinates are axial coordinates
		var center = hex.hexToPos(hexPos);
		
		var angle=0;
		var xPos=0;
		var yPos=0;
		context.lineWidth = 1;
		context.beginPath();
		for (var i = 0; i < 6; i++) {
		    angle = 2 * Math.PI / 6 * i;
		    xPos = center.x * blocksize + hexSize * Math.cos(angle); //TODO:Performance?
		    yPos = center.y * blocksize + hexSize * Math.sin(angle);
		    if (i === 0){
		        context.moveTo(xPos, yPos);
		    }else{
		        context.lineTo(xPos, yPos);
		    }
		}
		context.closePath();
		if(filled===true){
			context.fill();
		}else{
			context.stroke();
		}
	};
	
	this.drawSproutLeaf = function(pos) {
		flowerUi.drawSproutLeaf(pos);
	};
	this.drawBud = function(pos,to,grow) {
		flowerUi.drawBud(pos,to,grow);
	};
	this.drawBlossom = function(pos) {
		flowerUi.drawBlossom(pos);
	};
	this.drawSeed = function(pos,grow) {
		flowerUi.drawSeed(pos,grow);
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
	
	this.drawHelpTexts = function(){
		helpTextsUi.drawAll(this);
	};
	
	this.redrawBackground = function(){
		backgroundUi.redraw(this);
	};
	this.redrawFlower = function(){
		flowerUi.redraw(this);
	};
	this.redrawOtherPlants = function() {
		ui.grass.redraw(this);
	};
	
	this.showGauges = function(){
		gaugesUi.draw(this);
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
    
    this.drawAnimals = function(){
    	// Draw some bees
    	animalsUi.drawAnimals(this);
    };
    this.drawBee = function(pos) {
    	var ctx=context;
    	var xpos=pos.x*blocksize-12;
    	var ypos=pos.y*blocksize-8;
    	var scale=0.1;
    	var lineWidth=0;
    		ctx.save();
    		ctx.strokeStyle = 'rgba(0,0,0,0)';
    		ctx.lineCap = 'round';
    		ctx.lineJoin = 'miter';
    		ctx.miterLimit = 4;
    		ctx.save();
//    		ctx.save();
    		ctx.fillStyle = "#ffff00";
    		ctx.strokeStyle = "#000000";
    		ctx.lineCap = "butt";
    		ctx.lineJoin = "miter";
    		ctx.beginPath();
    		ctx.moveTo(2*scale+xpos,94*scale+ypos);
    		ctx.bezierCurveTo(3*scale+xpos,93*scale+ypos,25*scale+xpos,51*scale+ypos,76*scale+xpos,50*scale+ypos);
    		ctx.bezierCurveTo(127*scale+xpos,49*scale+ypos,137*scale+xpos,67*scale+ypos,137*scale+xpos,67*scale+ypos);
    		ctx.bezierCurveTo(137*scale+xpos,67*scale+ypos,157*scale+xpos,95*scale+ypos,158*scale+xpos,95*scale+ypos);
    		ctx.bezierCurveTo(159*scale+xpos,95*scale+ypos,122*scale+xpos,136*scale+ypos,75*scale+xpos,133*scale+ypos);
    		ctx.bezierCurveTo(28*scale+xpos,130*scale+ypos,1*scale+xpos,95*scale+ypos,2*scale+xpos,94*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.beginPath();// Head
    		ctx.moveTo(150*scale+xpos,36*scale+ypos);
    		ctx.bezierCurveTo(169.88225099390857*scale+xpos,36*scale+ypos,186*scale+xpos,51.22231850575302*scale+ypos,186*scale+xpos,70*scale+ypos);
    		ctx.bezierCurveTo(186*scale+xpos,88.77768149424698*scale+ypos,169.88225099390857*scale+xpos,104*scale+ypos,150*scale+xpos,104*scale+ypos);
    		ctx.bezierCurveTo(130.11774900609143*scale+xpos,104*scale+ypos,114*scale+xpos,88.77768149424698*scale+ypos,114*scale+xpos,70*scale+ypos);
    		ctx.bezierCurveTo(114*scale+xpos,51.22231850575302*scale+ypos,130.11774900609143*scale+xpos,36*scale+ypos,150*scale+xpos,36*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.fillStyle = "#000000";
    		ctx.beginPath();
    		ctx.moveTo(164*scale+xpos,53*scale+ypos);
    		ctx.bezierCurveTo(167.86599324881556*scale+xpos,53*scale+ypos,171*scale+xpos,56.134006751184444*scale+ypos,171*scale+xpos,60*scale+ypos);
    		ctx.bezierCurveTo(171*scale+xpos,63.865993248815556*scale+ypos,167.86599324881556*scale+xpos,67*scale+ypos,164*scale+xpos,67*scale+ypos);
    		ctx.bezierCurveTo(160.13400675118444*scale+xpos,67*scale+ypos,157*scale+xpos,63.865993248815556*scale+ypos,157*scale+xpos,60*scale+ypos);
    		ctx.bezierCurveTo(157*scale+xpos,56.134006751184444*scale+ypos,160.13400675118444*scale+xpos,53*scale+ypos,164*scale+xpos,53*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.beginPath();
    		ctx.moveTo(33*scale+xpos,120*scale+ypos);
    		ctx.lineTo(52*scale+xpos,128*scale+ypos);
    		ctx.bezierCurveTo(52*scale+xpos,128*scale+ypos,33*scale+xpos,63*scale+ypos,33*scale+xpos,63*scale+ypos);
    		ctx.bezierCurveTo(33*scale+xpos,63*scale+ypos,15*scale+xpos,78*scale+ypos,14*scale+xpos,78*scale+ypos);
    		ctx.lineTo(33*scale+xpos,120*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.lineWidth = lineWidth;
    		ctx.beginPath();
    		ctx.moveTo(74*scale+xpos,132*scale+ypos);
    		ctx.bezierCurveTo(74*scale+xpos,132*scale+ypos,98*scale+xpos,131*scale+ypos,98*scale+xpos,131*scale+ypos);
    		ctx.bezierCurveTo(98*scale+xpos,131*scale+ypos,91*scale+xpos,54*scale+ypos,91*scale+xpos,54*scale+ypos);
    		ctx.bezierCurveTo(91*scale+xpos,54*scale+ypos,60*scale+xpos,58*scale+ypos,60*scale+xpos,58*scale+ypos);
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.fillStyle = "#bfbfbf";
    		ctx.strokeStyle = "#000000";
    		ctx.lineWidth = lineWidth;
    		ctx.lineCap = "round";
    		ctx.lineJoin = "miter";
    		ctx.beginPath();
    		ctx.moveTo(70*scale+xpos,66.828598*scale+ypos);
    		ctx.bezierCurveTo(71.280579*scale+xpos,35.26712*scale+ypos,102.014069*scale+xpos,-5.13158*scale+ypos,118.661377*scale+xpos,7.493011000000003*scale+ypos);
    		ctx.bezierCurveTo(135.308685*scale+xpos,20.117599000000002*scale+ypos,103.294647*scale+xpos,61.778762*scale+ypos,89.208466*scale+xpos,65.56613899999999*scale+ypos);
    		ctx.bezierCurveTo(75.122254*scale+xpos,69.35351499999999*scale+ypos,70*scale+xpos,66.828598*scale+ypos,70*scale+xpos,66.828598*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
//    		ctx.fillStyle = "#bfbfbf";
//    		ctx.strokeStyle = "#000000";
//    		ctx.lineWidth = lineWidth;
//    		ctx.lineCap = "round";
//    		ctx.lineJoin = "miter";
    		ctx.beginPath();
    		ctx.moveTo(71*scale+xpos,66.828598*scale+ypos);
    		ctx.bezierCurveTo(69.471863*scale+xpos,35.26712*scale+ypos,32.796753*scale+xpos,-5.13158*scale+ypos,12.931061*scale+xpos,7.493011000000003*scale+ypos);
    		ctx.bezierCurveTo(-6.9346309999999995*scale+xpos,20.117603000000003*scale+ypos,31.268615999999998*scale+xpos,61.778762*scale+ypos,48.078034*scale+xpos,65.56613899999999*scale+ypos);
    		ctx.bezierCurveTo(64.887482*scale+xpos,69.35351499999999*scale+ypos,71.000001*scale+xpos,66.828598*scale+ypos,71.000001*scale+xpos,66.828598*scale+ypos);
    		ctx.closePath();
    		ctx.fill();
    		if(lineWidth>0){
    			ctx.stroke();
    		}
    		ctx.restore();
    		};    
}
