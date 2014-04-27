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
				model.registerEvent('key',function(key) {
					if(key===c.DIRECTION.BUTTON){
						util.scenes.setScene("Game");
					}
				});
				model.uiRedrawNeeded();
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'Start',
					id: c.buttons.start,
					x:18-4,
					y:10,
					sx:8,
					sy:2,
					callback:function(){
						util.scenes.setScene("LevelSelect");
//						util.scenes.setScene("Game");
				    }
				});
//				// Cheats:
//				if(cheat===true){
//					util.buttons.addButton({
//						text:'Start fast + Resource',
//						id: c.buttons.startFastResource,
//						x:0,
//						y:17,
//						sx:9,
//						sy:2,
//						callback:function(){
//							util.scenes.setScene("LevelSelect");
//							model.cheat('fast');
//							model.cheat('fastAnim');
//							model.resourceCheat=true;
//					    }
//					});
//				}
			},
			exit: function(){
				util.buttons.removeAll();
			},
			
			redraw : function(view){
				if(model.isUiRedrawNeeded()){
					view.layerUi();
					view.clearBackground();
					view.text({
						text:"Miner",
						x:18,y:2,
						size:3,
						center:true,
					});
					view.drawButtons();
				}
				
			},
	};
//	this.levelSelect = {
//			name : "LevelSelect",
//			clearBackground : false,
//			
//			start: function(){
//				// Add the buttons
//				util.buttons.removeAll();
//				model.reset();
//
//				var locked=true;
//				var xAmmount=4;
//				var yAmmount=3;
//				var xSize = 6;
//				var ySize = 7;
//				for (var x = 0; x < xAmmount; x++) {
//					for (var y = 0; y < yAmmount; y++) {
//						var number=y*xAmmount+x;
//						if(number==0){
//							locked=false;
//						};
//						if(model.levelExists(number+1)===true){
//							locked=false;
//						}else{
//							locked=true;
//						}
//						util.buttons.addButton({
//							locked:locked,
//							text:number+1,
//							id: number+201,
//							x:x*xSize+3.5,
//							y:y*ySize+2,
//							sx:xSize-1,
//							sy:ySize-1,
//							callback: function(buttonId) {
//								level=buttonId-200;
//								util.scenes.setScene("Game");
//							}
//						});
//					}
//				}				
//				this.clearBackground=true;
//			},
//			
//			regularCallback : function() {
//				this.clearBackground=true;
//			},
//			
//			redraw : function(view){
//				if(this.clearBackground===true){
//					view.clearBackground();
//				}
//				if(model.isUiRedrawNeeded()===true){
//					view.clearUi();
//				}
//			},
//	};

	this.game = {
			name : "Game",
			clearBackground : false,
			delay: 10,
			counter: 0,
			
			start: function(){
				// Init Model
//				model.loadLevel(level);
				
				// Add the buttons
				model.clearEvents('key');
				util.buttons.removeAll();
				this.clearBackground=true;
				model.uiRedrawNeeded();
				model.startLevel();
				model.registerEvent('drowned',function(){
					util.scenes.setScene("Died");
				});
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
		
		start: function(){
			model.uiRedrawNeeded();
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
					text:"You are Dead",
					x:18,y:2,
					size:4,
					center:true,
				});
			}
		},
	};
	
}