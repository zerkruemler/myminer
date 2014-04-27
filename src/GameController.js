function GameController() {
	
	var model=undefined;
	var view=undefined;
	
	this.reset = function(gameModel, gameView){
		gameView.getCanvas().removeKeyDownEvent(keyPressed);
		gameView.getCanvas().addKeyDownEvent(keyPressed);
		gameView.getCanvas().removeKeyUpEvent(keyReleased);
		gameView.getCanvas().addKeyUpEvent(keyReleased);
		model=gameModel;
		view=gameView;
	};

	
	function keyPressed(event){
		decodeKeyCodes(event.keyCode,true);
	}
	function keyReleased(event){
		decodeKeyCodes(event.keyCode,false);
	}
	function decodeKeyCodes(keyCode,down) {
		
		switch (keyCode) {
		case c.KEY.UP:
		case c.KEY.W:
			model.keyPressed(c.DIRECTION.UP,down);
			break;
		case c.KEY.DOWN:
		case c.KEY.S:
			model.keyPressed(c.DIRECTION.DOWN,down);
			break;
		case c.KEY.LEFT:
		case c.KEY.A:
			model.keyPressed(c.DIRECTION.LEFT,down);
			break;
		case c.KEY.RIGHT:
		case c.KEY.D:
			model.keyPressed(c.DIRECTION.RIGHT,down);
			break;
		case c.KEY.SPACE:
		case c.KEY.ENTER:
			model.keyPressed(c.DIRECTION.BUTTON,down);
		default:
			break;
		}
	}	
}
