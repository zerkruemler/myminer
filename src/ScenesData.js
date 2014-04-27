function ScenesData(){
	
//	var view;
//	this.setView = function(gameView){
//		view=gameView;
//	};
	var model=undefined;
	var cheat=true;
	var level=1;
	var flowRate=15;
	
	this.reset = function(gameModel){
		model = gameModel;
	};
	
	this.title = {
			name : "Title",
			
			start: function(){
				// Add the buttons
				model.clearEvents('key');
				model.registerEvent('key',function(key) {
					if(key===c.DIRECTION.BUTTON){
						util.scenes.setScene("Game");
					}
				});
				model.resetToMenu();
				model.uiRedrawNeeded();
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'Space to Start',
					id: c.buttons.start,
					x:18-6,
					y:10,
					sx:12,
					sy:2,
					callback:function(){
						util.scenes.setScene("LevelSelect");
//						util.scenes.setScene("Game");
				    }
				});
			},
			exit: function(){
				util.buttons.removeAll();
			},
			
			redraw : function(view){
				if(model.isUiRedrawNeeded()){
					view.layerUi();
					view.clearBackground();
					view.clearUi();
					view.text({
						text:"Flooded Mines",
						x:18,y:2,
						size:3,
						center:true,
					});
					view.drawButtons();
				}
				
			},
	};

	this.game = {
			name : "Game",
			clearBackground : false,
			delay: 10,
			counter: 0,
			
			start: function(){
				// Init Model
//				model.loadLevel(level);
				this.delay=10;
				this.counter=0;
				// Add the buttons
				model.clearEvents('key');
				util.buttons.removeAll();
				this.clearBackground=true;
				model.uiRedrawNeeded();
				model.startLevel();
				model.clearEvents('drowned');
				model.registerEvent('drowned',function(){
					util.scenes.setScene("Died");
				});
				model.clearEvents('finished');
				model.registerEvent('finished',function(){
					util.scenes.setScene("LevelWon");
				});
			},
			
			regularCallback : function() {
//				model.setXPos(model.getXPos()-0.1);
				model.movePlayer();
//				this.clearBackground=true;
				this.counter++;
				if(this.counter>flowRate){
					this.counter=0;
					this.delay--;
					if(this.delay<0){
						model.getLevel().flow();
					}
				}
			},
			
			redraw : function(view){
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
					view.createLevelImage();
					var level=model.getLevel();
					start=level.getStartPoint();
					start.y=level.getLevelSize().y-1;
					level.initWater(start.x, start.y);
					level.addCollectibleObjects(10);
				}
				if(this.clearBackground===true){
					view.clearBackground();
					view.redrawBackground(model.getXPos());
					view.drawPlayer(model.getPlayerPos());
					view.drawScores();
//					this.clearBackground=false;
				}
				// Updates which are done each frame (fast animations)
//				model.updateAnimals();
				
			},
	};

	this.levelWon = {
		name : "LevelWon",
		counter:0,
		
		start: function(){
			model.uiRedrawNeeded();
			model.nextLevel();
		},
		
		regularCallback : function() {
			this.counter++;
			if(this.counter>100){
				this.counter=0;
				util.scenes.setScene("Game");
			}
		},
		
		redraw : function(view){
			if(model.isUiRedrawNeeded()){
				view.layerUi();
				view.clearBackground();
				view.text({
					text:"Survived!",
					x:18,y:2,
					size:4,
					center:true,
				});
			}
		},
	};
	
	
	this.died = {
		name : "Died",
		counter:0,
		wait:100,
		
		start: function(){
			model.uiRedrawNeeded();
			if(model.getScores().lives===0){
				this.wait=200;
			}
		},
		
		regularCallback : function() {
			this.counter++;
			if(this.counter>this.wait){
				this.counter=0;
				var scores = model.getScores();
				if(scores.lives===0){
					util.scenes.setScene("Title");
				}else{
					util.scenes.setScene("Game");
				}
			}
		},
		
		redraw : function(view){
			if(model.isUiRedrawNeeded()){
				view.layerUi();
				view.clearBackground();
				if(model.getScores().lives===0){
					view.text({
						text:"Game Over",
						x:18,y:12,
						size:6,
						outline:1,
//						color:  '#FF5050',
						color: '#800000',
						center:true,
					});
				}else{
					view.text({
						text:"You are Dead",
						x:18,y:2,
						size:4,
						center:true,
					});
				}
			}
		},
	};
	
}