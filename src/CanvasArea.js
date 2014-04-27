function CanvasArea() {

    var canvasBackground=undefined;
    var contextBackground=undefined;
    var canvasUi=undefined;
    var contextUi=undefined;
    var size = {};

    this.reset = function() {

        size.x = c.CANVAS_SIZE_X;
    	size.y = c.CANVAS_SIZE_Y;
        canvasBackground = document.getElementById('background');
        canvasBackground.style.border = "2px solid red";
        contextBackground = canvasBackground.getContext('2d');
        canvasUi = document.getElementById('ui');
        canvasUi.style.border = "2px solid blue";
        contextUi = canvasUi.getContext('2d');
        this.resize(size);
    };
    this.resize = function(newSize){
    	size=newSize;
        canvasBackground.width  = size.x;
        canvasBackground.height = size.y;
        canvasUi.width  = size.x;
        canvasUi.height = size.y;
    };
    this.addEventListener = function(name,functionName){
    	canvasUi.addEventListener(name,functionName);
    };
    this.removeEventListener = function(name,functionName){
    	canvasUi.removeEventListener(name,functionName);
    };
    
	this.addKeyDownEvent =function(callback){
		window.addEventListener("keydown",callback,true);
	};
	this.removeKeyDownEvent =function(callback){
		window.removeEventListener("keydown",callback,true);
	};
	this.addKeyUpEvent =function(callback){
		window.addEventListener("keyup",callback,true);
	};
	this.removeKeyUpEvent =function(callback){
		window.removeEventListener("keyup",callback,true);
	};

	
    this.getContextBackground = function(){
    	return contextBackground;
    };
    this.getContext = function(){
    	return context;
    };
    this.getContextUi = function(){
    	return contextUi;
    };

    this.getSize = function(){
    	return size;
    };
    
	this.clearBackground = function() {
		contextBackground.fillStyle = c.color.background.game;
		contextBackground.fillRect(0, 0, size.x, size.y);
	};
	
	this.clearScreen = function() {
		context.clearRect(0,0,size.x,size.y);
	};

	this.clearUi = function() {
		contextUi.clearRect(0,0,size.x,size.y);
	};

}