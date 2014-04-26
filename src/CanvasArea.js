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
        canvasBackground.width  = size.x;
        canvasBackground.height = size.y;
        canvasBackground.style.border = "2px solid red";
        contextBackground = canvasBackground.getContext('2d');

        canvasUi = document.getElementById('ui');
        canvasUi.width  = size.x;
        canvasUi.height = size.y;
        canvasUi.style.border = "2px solid blue";
        contextUi = canvasUi.getContext('2d');
    };
    this.addEventListener = function(name,functionName){
    	canvasUi.addEventListener(name,functionName);
    };
    this.removeEventListener = function(name,functionName){
    	canvasUi.removeEventListener(name,functionName);
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