function ScenesData(){
	
//	var view;
//	this.setView = function(gameView){
//		view=gameView;
//	};
	var model=undefined;
	var cheat=true;
	var level=1;
	
	this.reset = function(gameModel){
		model = gameModel;
	};
	
	this.title = {
			name : "Title",
			
			start: function(){
				// Add the buttons
				model.registerEvent('key',function(key) {
					if(key=c.DIRECTION.BUTTON){
						util.scenes.setScene("Game");
					}
				});
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'Start',
					id: c.buttons.start,
					x:11,
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
				this.layerUi = function() {
					context=contextUi;
				};
				view.layerUi();
				model.uiRedrawNeeded();
				view.clearBackground();
				view.text({
					text:"Greedy Miner",
					x:15,y:2,
					size:3,
					center:true,
				});
				view.drawButtons();
				
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
			
			start: function(){
				// Init Model
//				model.loadLevel(level);
				
				// Add the buttons
				util.buttons.removeAll();
				this.clearBackground=true;
				model.uiRedrawNeeded();

			},
			
			regularCallback : function() {
//				this.clearBackground=true;
			},
			
			redraw : function(view){
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
				}
				if(this.clearBackground===true){
					view.clearBackground();
					view.redrawBackground();
					this.clearBackground=false;
				}
				// Updates which are done each frame (fast animations)
//				model.updateAnimals();
				
			},
	};

//	this.levelWon = {
//			name : "LevelWon",
//			redrawFlower: 0,
//			
//			start: function(){
//				// Init Model
//				var animals = model.getAnimals();
//				animals.removeBees();
//				// Add the buttons
//				util.buttons.removeAll();
//				util.buttons.addButton({
//					text:'To Title',
//					id: c.buttons.toTitle,
//					x:5,
//					y:8,
//					sx:8,
//					sy:2,
//					callback:function(){
//						flowerData=model.saveFlower();
//						util.scenes.setScene("Title");
//				    }
//				});
//				util.buttons.addButton({
//					text:'Next Level',
//					id: c.buttons.toNextLevel,
//					x:17,
//					y:8,
//					sx:8,
//					sy:2,
//					callback:function(){
//						flowerData=model.saveFlower();
//						level+=1;
//						util.scenes.setScene("Game");
//				    },
//				});
//			},
//			
//			regularCallback : function() {
//			},
//			
//			redraw : function(view){
//				this.redrawFlower-=1;
//				if(this.redrawFlower<=0){
//					this.redrawFlower=5;
//					view.clear();
//					view.redrawFlower();
//					model.updateFlower();
//				}
//				if(model.isUiRedrawNeeded()===true){
//					view.clearUi();
//					view.showGauges();
//				}
//				view.clearAnimals();
//				view.drawAnimals();
//				// Updates which are done each frame (fast animations)
//				model.updateAnimals();
//			},
//	};
	
}