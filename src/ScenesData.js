function ScenesData(){
	
//	var view;
//	this.setView = function(gameView){
//		view=gameView;
//	};
	var model=undefined;
	var flowerData=undefined;
	var cheat=true;
	var level=1;
	
	this.reset = function(gameModel){
		model = gameModel;
	};
	
	this.title = {
			name : "Title",
			
			start: function(){
				// Add the buttons
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
//				util.buttons.addButton({
//					text:'Garden',
//					id: c.buttons.garden,
//					x:11,
//					y:13,
//					sx:8,
//					sy:2,
//					callback:function(){
//						util.scenes.setScene("Garden");
//				    }
//				});
				// Cheats:
				if(cheat===true){
					util.buttons.addButton({
						text:'Start fast + Resource',
						id: c.buttons.startFastResource,
						x:0,
						y:17,
						sx:9,
						sy:2,
						callback:function(){
							util.scenes.setScene("LevelSelect");
							model.cheat('fast');
							model.cheat('fastAnim');
							model.resourceCheat=true;
					    }
					});
					util.buttons.addButton({
						text:'Start fast',
						id: c.buttons.startFast,
						x:0,
						y:19,
						sx:9,
						sy:2,
						callback:function(){
							util.scenes.setScene("LevelSelect");
							model.cheat('fast');
							model.cheat('fastAnim');
					    }
					});
					util.buttons.addButton({
						text:'Start Resource',
						id: c.buttons.startResource,
						x:0,
						y:21,
						sx:9,
						sy:2,
						callback:function(){
							util.scenes.setScene("LevelSelect");
							model.cheat('fast');
							model.resourceCheat=true;
					    }
					});
					util.buttons.addButton({
						text:'Fast + Res. + Bees',
						id: c.buttons.startFastResourceBee,
						x:0,
						y:23,
						sx:9,
						sy:2,
						callback:function(){
							util.scenes.setScene("LevelSelect");
							model.cheat('fast');
							model.cheat('fastAnim');
							model.cheatEarlyBee=true;
							model.resourceCheat=true;
						}
					});
				}
			},
			exit: function(){
				util.buttons.removeAll();
			},
			
			redraw : function(view){
				this.layerUi = function() {
					context=contextUi;
				};
				model.uiRedrawNeeded();
				view.clear();
				view.clearUi();
				view.clearAnimals();
				view.clearBackground();
				view.text({
					text:"Flower Power",
					x:15,y:2,
					size:3,
					center:true,
				});
//				view.drawBlossom({x:10.03,y:3.63});
//				view.drawBlossom({x:18.0,y:3.63});
				
			},
	};
	this.levelSelect = {
			name : "LevelSelect",
			clearBackground : false,
			
			start: function(){
				// Add the buttons
				util.buttons.removeAll();
				model.reset();

				var locked=true;
				var xAmmount=4;
				var yAmmount=3;
				var xSize = 6;
				var ySize = 7;
				for (var x = 0; x < xAmmount; x++) {
					for (var y = 0; y < yAmmount; y++) {
						var number=y*xAmmount+x;
						if(number==0){
							locked=false;
						};
						if(model.levelExists(number+1)===true){
							locked=false;
						}else{
							locked=true;
						}
						util.buttons.addButton({
							locked:locked,
							text:number+1,
							id: number+201,
							x:x*xSize+3.5,
							y:y*ySize+2,
							sx:xSize-1,
							sy:ySize-1,
							callback: function(buttonId) {
								level=buttonId-200;
								util.scenes.setScene("Game");
							}
						});
					}
				}				
				this.clearBackground=true;
			},
			
			regularCallback : function() {
				this.clearBackground=true;
			},
			
			redraw : function(view){
				if(this.clearBackground===true){
					view.clearBackground();
				}
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
				}
			},
	};

	this.game = {
			name : "Game",
			clearBackground : false,
			redrawFlower: 0,
			bees: 0,
			
			start: function(){
				// Init Model
				model.loadLevel(level);
				model.plantSeed();
				this.bees=0;
				
				// Add the buttons
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'Exit',
					id: c.buttons.start,
					x:0,
					y:0,
					sx:2,
					sy:1.8,
					callback:function(){
						flowerData=model.saveFlower();
						util.scenes.setScene("Title");
				    }
				});
				this.clearBackground=true;
				model.uiRedrawNeeded();
			},
			
			regularCallback : function() {
				this.clearBackground=true;
				model.updateResources();
				var dayTime = model.getDayTime();
				// Bees fly only when the sun is up in the sky
				if((dayTime>270 && dayTime<500 && this.bees===0) ||
					(model.cheatEarlyBee===true && this.bees<3)	){
					var animals = model.getAnimals();
					animals.addBee();
					this.bees+=1;
				}
				// Bees stop flying when the sun sets
				if(dayTime>700 && this.bees>0){
					var animals = model.getAnimals();
					animals.removeBees();
				};
			},
			
			redraw : function(view){
				if(this.clearBackground===true){
					view.clearBackground();
					view.redrawBackground();
					this.clearBackground=false;
				}
				this.redrawFlower-=1;
				if(this.redrawFlower<=0){
					this.redrawFlower=5;
					view.clear();
					view.redrawFlower();
					if(model.getLevel().grass===true){
						view.redrawOtherPlants();
					}
					view.showHoveredHexagon();
					view.showOptions();
					model.updateFlower();
					model.updateOtherPlants();
				}
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
					view.showGauges();
					view.showHoveredHexagon();
					view.showOptions();
					model.updateHelpTexts();
					view.drawHelpTexts();
				}
				view.clearAnimals();
				view.drawAnimals();
				// Updates which are done each frame (fast animations)
				model.updateAnimals();
				
			},
	};
	this.garden = {
			name : "Garden",
			clearBackground : false,
			redrawFlower: 0,
			
			start: function(){
				// Init Model
				model.reset();
				model.loadLevel('G'); // Load the garden Level
				// Load the flowerModel into the model
				model.loadFlower(flowerData);
				
				
				// Add the buttons
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'Exit',
					id: c.buttons.start,
					x:0,
					y:0,
					sx:3,
					sy:2,
					callback:function(){
						util.scenes.setScene("Title");
				    }
				});
				this.clearBackground=true;
			},
			
			regularCallback : function() {
				this.clearBackground=true;
//				var dayTime = model.getDayTime();
			},
			
			redraw : function(view){
				if(this.clearBackground===true){
					view.clearBackground();
					view.redrawBackground();
					this.clearBackground=false;
				}
				this.redrawFlower-=1;
				if(this.redrawFlower<=0){
					this.redrawFlower=5;
					view.clear();
					view.redrawFlower();
					model.updateFlower();
				}
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
//					model.updateHelpTexts();
//					view.drawHelpTexts();
				}
			},
	};
	this.levelWon = {
			name : "LevelWon",
			redrawFlower: 0,
			
			start: function(){
				// Init Model
				var animals = model.getAnimals();
				animals.removeBees();
				// Add the buttons
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'To Title',
					id: c.buttons.toTitle,
					x:5,
					y:8,
					sx:8,
					sy:2,
					callback:function(){
						flowerData=model.saveFlower();
						util.scenes.setScene("Title");
				    }
				});
				util.buttons.addButton({
					text:'Next Level',
					id: c.buttons.toNextLevel,
					x:17,
					y:8,
					sx:8,
					sy:2,
					callback:function(){
						flowerData=model.saveFlower();
						level+=1;
						util.scenes.setScene("Game");
				    },
				});
			},
			
			regularCallback : function() {
			},
			
			redraw : function(view){
				this.redrawFlower-=1;
				if(this.redrawFlower<=0){
					this.redrawFlower=5;
					view.clear();
					view.redrawFlower();
					model.updateFlower();
				}
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
					view.showGauges();
				}
				view.clearAnimals();
				view.drawAnimals();
				// Updates which are done each frame (fast animations)
				model.updateAnimals();
			},
	};
	this.levelLost = {
			name : "LevelLost",
			redrawFlower: 0,
			
			start: function(){
				// Init Model
				var animals = model.getAnimals();
				animals.removeBees();
				// Add the buttons
				util.buttons.removeAll();
				util.buttons.addButton({
					text:'To Title',
					id: c.buttons.toTitle,
					x:5,
					y:8,
					sx:8,
					sy:2,
					callback:function(){
						util.scenes.setScene("Title");
				    }
				});
				util.buttons.addButton({
					text:'Replay Level',
					id: c.buttons.toNextLevel,
					x:17,
					y:8,
					sx:8,
					sy:2,
					callback:function(){
						util.scenes.setScene("Game");
				    },
				});
				model.uiRedrawNeeded();
			},
			
			regularCallback : function() {
			},
			
			redraw : function(view){
				this.redrawFlower-=1;
				if(this.redrawFlower<=0){
					this.redrawFlower=5;
					view.clear();
					view.redrawFlower();
					model.updateFlower();
				}
				if(model.isUiRedrawNeeded()===true){
					view.clearUi();
					view.showGauges();
				}
				view.layerUi();
				view.text({
					text:"Level Lost",
					x:15,y:2,
					size:3,
					center:true,
				});
				view.clearAnimals();
				view.drawAnimals();
				// Updates which are done each frame (fast animations)
				model.updateAnimals();
			},
	};
	
}