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
    var flowerUi=undefined;
    var gaugesUi=undefined;
    var optionsUi=undefined;
    var animalsUi=undefined;
    var grassUi=undefined;
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
        backgroundUi   = new BackgroundUi();
        flowerUi       = new FlowerUi();
        grassUi        = new GrassUi();
        gaugesUi       = new GaugesUi();
        optionsUi      = new OptionsUi();
        animalsUi      = new AnimalsUi();
        helpTextsUi    = new HelpTextsUi();
        
        util.buttons = buttons;
        util.scenes  = scenes;
                    
    }
    function resetObjects(){
    	
    	buttons.reset(gameModel);
    	buttonsUi.reset(buttons,gameView);

    	backgroundUi.reset(gameModel);
    	flowerUi.reset(gameModel);
    	grassUi.reset(gameModel);
    	gaugesUi.reset(gameModel);
    	optionsUi.reset(gameModel);
    	animalsUi.reset(gameModel);
    	helpTextsUi.reset(gameModel);
    	
        canvasArea.reset();
        scenes.reset(gameModel);
        // Add all scenes
        scenes.addScene(scenesData.title);
        scenes.addScene(scenesData.game);
        scenes.addScene(scenesData.garden);
        scenes.addScene(scenesData.levelWon);
        scenes.addScene(scenesData.levelLost);
        scenes.addScene(scenesData.levelSelect);
        
        scenesData.reset(gameModel);
        gameModel.reset();
        gameView.reset(gameModel,canvasArea);
        gameView.addUi('grass',grassUi);
        gameView.addBackgroundUi(backgroundUi);
        gameView.addFlowerUi(flowerUi);
        gameView.addGaugesUi(gaugesUi);
        gameView.addOptionsUi(optionsUi);
        gameView.addAnimalsUi(animalsUi);
        gameView.addHelpTextsUi(helpTextsUi);
        gameView.registerMouse(buttonsUi);
        gameController.reset(gameModel,gameView);
    }

    loop = function() {
        requestAnimFrame(loop);
        scenes.redraw(gameView);
        buttonsUi.drawAll();
    };
};


//loop = function() {
//    requestAnimFrame(loop);
//    canvasArea.redrawAll();
//};

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
