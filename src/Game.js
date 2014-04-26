function init() {
    var game = new Game();
    game.start();
};

var util={};

function Game() {

	var canvasArea=undefined;
	var scenes=undefined; 
	var scenesData =undefined;
    var gameModel=undefined;
    var gameView=undefined;
    var gameController=undefined;
    var buttons=undefined;
    var buttonsUi=undefined;
    var level=undefined;
    
    this.start = function() {
    	
    	createObjects();
    	resetObjects();
    	
    	scenes.setScene(scenesData.title.name);
    	
        loop();        
    };


    function createObjects(){
        canvasArea     = new CanvasArea();
        buttons        = new Buttons();
        buttonsUi      = new ButtonsUi();
        scenes         = new Scenes();
        scenesData     = new ScenesData();
        gameModel      = new GameModel();
        gameView       = new GameView();
        gameController = new GameController();
        level          = new Level();
//        backgroundUi   = new BackgroundUi();
//        flowerUi       = new FlowerUi();
//        grassUi        = new GrassUi();
//        gaugesUi       = new GaugesUi();
//        optionsUi      = new OptionsUi();
//        animalsUi      = new AnimalsUi();
//        helpTextsUi    = new HelpTextsUi();
//        
        util.buttons = buttons;
        util.scenes  = scenes;
                    
    }
    function resetObjects(){
    	
    	buttons.reset(gameModel);
    	buttonsUi.reset(buttons,gameView);
    	
    	level.reset();

        canvasArea.reset();
        scenes.reset(gameModel);
        // Add all scenes
        scenes.addScene(scenesData.title);
        scenes.addScene(scenesData.game);
        
        scenesData.reset(gameModel);
        gameModel.reset();
        gameModel.setLevel(level);
        gameView.reset(gameModel,canvasArea);
        gameController.reset(gameModel,gameView);
        
        gameView.addUi('buttons', buttonsUi);
        gameView.addUi('level',level);
    }

    loop = function() {
        requestAnimFrame(loop);
        scenes.redraw(gameView);
    };
};



window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
