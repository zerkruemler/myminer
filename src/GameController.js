function GameController() {
	
	var model=undefined;
	var view=undefined;
	
	this.reset = function(gameModel, gameView){
		gameView.getCanvas().removeKeyDownEvent(keyPressed);
		gameView.getCanvas().addKeyDownEvent(keyPressed);
		model=gameModel;
		view=gameView;
	};

	
	function keyPressed(event){
		switch (event.keyCode) {
		case c.KEY.UP:
		case c.KEY.W:
			model.keyPressed(c.DIRECTION.UP);
			break;
		case c.KEY.DOWN:
		case c.KEY.S:
			model.keyPressed(c.DIRECTION.DOWN);
			break;
		case c.KEY.LEFT:
		case c.KEY.A:
			model.keyPressed(c.DIRECTION.LEFT);
			break;
		case c.KEY.RIGHT:
		case c.KEY.D:
			model.keyPressed(c.DIRECTION.RIGHT);
			break;
		case c.KEY.SPACE:
		case c.KEY.ENTER:
			model.keyPressed(c.DIRECTION.BUTTON);
		default:
			break;
		}
	}	
}
