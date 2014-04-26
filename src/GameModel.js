function GameModel() {
	
	var animals = undefined;
	var flower = undefined;       // Part of the flower which is above the ground including seed
	var roots  = undefined;       // Part of the flower which is under the ground including seed
	var hexClickPos = undefined;
	var resources = undefined;
	var seeds = 0;        // current seeds
	var level = undefined; // Level object retrieved from Levels
	var levels = new Levels();
	var daystart=new Date();
	var requirementFulfilled=false;
	var options=undefined;
	var uiRedraw=false;
	var oldTime=undefined;
	var timedifference=undefined;
	var speedup=1;
	var $this=this;
	this.resourceCheat=false;
	this.cheatEarlyBee=false;

	
	this.reset = function(){
	    flower = new Flower();
        flower.reset();
	    roots = new Flower();           // Root is technically also a flower (growing into the earth)
        roots.reset();
        resources = new Resources();
        resources.reset(this);
        seeds=0;
        daystart=new Date();            // Daytime goes from 0 to 1000 sunrise to sunset 
        oldTime=daystart.getTime();
    	uiRedraw=true;
    	animals = new Animals();
    	animals.reset(this);
    	events.startLevel.notify();
	};
	
	var events={
		buttonSelection : new Event(),
		startLevel : new Event(),
		game : new Event(),
	};
	
	this.loadLevel = function(levelNumber){
        level= levels.getLevel(levelNumber);
        helpTextsUi.reset(this);
        helpTextsUi.addText({x:15,y:5},level.name,3,'d','32,32,192','92,92,192');
        
	};
	this.levelExists = function(levelNumber) {
		return levels.levelExists(levelNumber);
	};
	
	this.loadFlower = function(flowerData){
		// Load a flower into the flower and root objects
		flower.setFlowerJSON(flowerData.flower);
		roots.setFlowerJSON(flowerData.roots);
	};
	
	this.saveFlower = function(){
		return{
			flower:flower.getFlowerJSON(),
			roots :roots.getFlowerJSON()
		};
	};
	
	this.registerEvent = function(name,listener){
		events[name].attach(listener);
	};

	this.buttonClicked = function(button){
		events.buttonSelection.notify(button.id);
	};
	
	// Cheat functions
	this.cheat = function(name) {
		switch (name) {
		case 'fast':
			resources.fast();
			break;
		case 'fastAnim':
			speedup=10;
			break;
		default:
			break;
		}
	};
	
	this.clickedAt = function(hexClickPosIn){
		hexClickPos=hexClickPosIn;
		this.uiRedrawNeeded();
		if(hexClickPosIn!==undefined){
			calculatePosOptions(hexClickPosIn);
		}else{
			// Clear Options
			clearPosOptions();
		}
	};
	
	this.uiRedrawNeeded = function() {
		util.buttons.requireRedraw();
		uiRedraw=true;
	};
	this.isUiRedrawNeeded = function() {
		var redraw=uiRedraw;
		uiRedraw=false;
		return redraw;
	};
	
	this.getOptions = function() {
		return options;
	};
	
	this.getHexClickPos = function(){
		return hexClickPos;
	};
	
	this.getLevel = function() {
		return level;
	};
	this.getAnimals = function(){
		return animals;
	};
	this.getSeeds = function(){
		return seeds;
	};
	this.addSeed = function(){
		seeds+=1;
		if(seeds>=level.seedsNeeded){
			// Level won
			util.scenes.setScene("LevelWon");
		}
	};
	
	this.getLevelHex = function(hexpos) {
		var hexClone = hex.clone(hexpos);
		hexClone.r-=1;  // change from odd to even...
		var arrayPos = hex.hexToArray(hexClone);
		arrayPos.x*=2;
		arrayPos.x+=11;
		return {
			nutrient : level.layout[9-arrayPos.y][arrayPos.x+11],
			water    : level.layout[9-arrayPos.y][arrayPos.x+12],
		};
	};
	
	// Simulated day time for sun movement and maybe more?
	this.getDayTime=function(){
		var currentTime= new Date();
		var daytime=((currentTime.getTime()-daystart.getTime())/60/7)%1000;  // A 7 Minute day 0-1000 (miliseconds)
		if(daytime>990){
			// Level lost
			util.scenes.setScene("LevelLost");
		}
		return daytime;
	};

	// Flower functions
	this.plantSeed = function(){
		flower.plantSeed(this);
		var part=roots.plantSeed(this);
		resources.plantSeed(part);
	};
	
	this.sprout=function(){
		var seed=flower.sprout();
		seed.addAnim('c',this.getTime(),c.growtime.sprout/speedup);
		roots.sprout();
		this.growTo('u',true,true); // Don't trigger the growRoot event
		this.growTo('u',false,true);// Don't trigger the growStem event
		resources.sprout();
		events.game.notify('sprout');
	};
	
	this.growTo = function(direction,isRoot,noEvent){
		var parts=getParts();
		var part;
		if(isRoot===true){
			part=roots.growTo(this,parts.root, direction,speedup);
			resources.addRoot(part);
			if(noEvent!==true){
				events.game.notify('growRoot');
			}
		}else{
			part=flower.growTo(this,parts.part, direction,speedup);
			resources.addStem(part);
			if(noEvent!==true){
				events.game.notify('growStem');
			}
		}
	};
	function leafPossible(part){
		// check if a leaf can be grown here
		// therefore the connection has to be free
		var result={
				possible:false
		};
		var newHexPos;
		for ( var direction in part.here) {
			if(part.here[direction]===0 && direction!=='c'){
				// also the next field has to be empty
				var hexOffset = hex.directionToCoord(direction);
				newHexPos = hex.clone(part.pos);
				newHexPos.q+=hexOffset.q; 
				newHexPos.r+=hexOffset.r; 
				var furtherPart=flower.getPartAtPos(newHexPos, false);
				if(furtherPart){
					// there is something in the way...
					result[direction]=false;
				}else{
					result[direction]=true;
					result.possible=true;
				}
				
			}
		}
		var optimalLeaves = leafOptimum(part);
		var endResult={};
		var possible;
		for (var i = 0; i < optimalLeaves.length; i++) {
			if(result[optimalLeaves[i]]===true){
				possible=result[optimalLeaves[i]];
				endResult[optimalLeaves[i]]=possible;
				if(possible===true){
					endResult.possible=true;
				}
			}
		}
		
		return endResult;
	}
	
	function leafOptimum(part){
		// check the stem and generate a list of good leaf positions
		var result=[];
		var flowerArray=flower.getFlower();
		var foundLeft=false;
		var foundRight=false;
		if(part.here.d!==0){
			// From directly below, either ur or ul
			// try to alternate leaves
			if(part.down){
				if(flowerArray[part.down[0]].here.ul==='l'){
					foundLeft=true;
				}
				if(flowerArray[part.down[0]].here.ur==='l'){
					foundRight=true;
				}
			}
			if(foundLeft===false && foundRight===false){
				// Random?
				if(Math.random()>0.5){
					foundLeft=true;
				}else{
					foundRight=true;
				} 
			};
			
			if(foundLeft===true){
				result.push('ur');
				result.push('ul');
			}
			if(foundRight===true){
				result.push('ul');
				result.push('ur');
			}
		}
		
		if(part.here.dl!==0){
			// Grown from down left (to up right)
			// From down left
			result.push('ul');
			result.push('dr');
		}
		if(part.here.dr!==0){
			// Grown from down right (to up left)
			result.push('ur');
			result.push('dl');
		}
		return result;
	}
	
	this.addLeaf = function(type){ // Todo: extract from Model
		if(type===undefined){
			type='l';
		}
		var parts=getParts();
		var here = parts.part.here;
		// Get all possible leaf positions
		var possibleLeaves = leafPossible(parts.part);
		// Get a priotized list of leaf positions
		var optimalLeaves = leafOptimum(parts.part);
		for (var i = 0; i < optimalLeaves.length; i++) {
			if(possibleLeaves[optimalLeaves[i]]===true){
				// found one
				var direction=optimalLeaves[i];
				here[direction]=type;  // leaf or blossom or bud(knospe)
				var to=hex.newHexAtDirection(parts.part.pos,direction);
				parts.part.addAnim(direction,this.getTime(),c.growtime.leaf/speedup);
//				hex.add(to,hex.directionToCoord(optimalLeaves[i]));

				if(type==='l'){
					resources.addLeaf(parts.part);
					events.game.notify('growLeaf');
				}
				if(type==='b'){
					flower.thicken();
					resources.addBud(parts.part);
					events.game.notify('growBud');
				}
				if(flower.getPartAtPos(to,false)===undefined){
					var part = new Part();
					part.placeholder(to,type,direction);
					part.addAnim('c',this.getTime(),c.growtime.bud/speedup);
					flower.addPart(part);
				}
				// Add only one of the possible
				return;
			}
		}
	};
	this.evolveBlossom = function() {
		// Evolve the bud to blossom and further
		var parts=getParts();
		var here = parts.part.here;
		if(here.c==='bu'){
			// already a bud there, progress to blossom
			here.c='bl';
			parts.part.addAnim('c',this.getTime(),c.growtime.blossom/speedup);
			resources.addBlossom(parts.part);
			animals.addBlossom(hex.hexToPos(parts.part.pos),parts.part);
			events.game.notify('toBlossom');
		}else if(here.c==='bl'){
			// already a blossom there, progress to seed
			here.c='se';
			parts.part.addAnim('c',this.getTime(),c.growtime.seed/speedup);
			resources.addBlossom(parts.part);
			animals.addBlossom(hex.hexToPos(parts.part.pos),parts.part);
			this.addSeed();
			events.game.notify('toSeed');
		}
	};
	
	function getParts(){
		var part=undefined;
		var root=undefined;
		// Get selected part
		if(hexClickPos){
			part = flower.getPartAtPos(hexClickPos,false); 
			root = roots.getPartAtPos(hexClickPos,true); 
		}
		return{
			part:part,
			root:root
		};
	}
	
	this.getFlower = function(){
		return flower.getFlower();
	};
	
	this.getRoots = function(){
		return roots.getFlower();
	};
	
	this.getPowerValues = function() {
		return resources.getPowerValues();
	};

	var clearPosOptions =function(){

		options={
				gl:0,    // The possible 
				gm:0,    // directions to 
				gr:0,    // move to
				o1:0,    // Option 1
				o2:0,    // Option 2
				o3:0,    // ...
		};
	};

	var calculatePosOptions =function(hexClickPos){
		// The options for this position are calculated here
		// and stored in the options object

		// Get the flower parts clicked on
		var part = flower.getPartAtPos(hexClickPos,false); 
		var root = roots.getPartAtPos(hexClickPos,true);
		clearPosOptions();
		

		if(part===undefined && root===undefined){
			return;
		}
		// See which fields can be grown to
		if(part!==undefined){
			// Special logic for seed
			if(part.here.c===5){
				// Unopened seed
				options.gm=2;
				return options;
			}
			// Check if part is already fully grown
			
			if($this.getTime()<part.growStart[part.direction]+part.growDuration[part.direction]){
				// Part is not fully grown
				return;
			}
			// leaves cannot be grown further
			if(part.here.c==='x' || part.here.c==='se' ){
				return;
			}
			// buds are grown into blossoms and further into seeds
			if(part.here.c==='bu'){
				if($this.getTime()<part.growStart.c+part.growDuration.c){
					// Bud is not fully grown
					return;
				}
				// A blossom can be evolved from the bud
				options.o1=2;
				return;
			}
			if(part.here.c==='bl'){
				if($this.getTime()<part.growStart.c+part.growDuration.c){
					// Blossom is not fully grown
					return;
				}
				// check if blossom was pollenized
				if(part.pollenized===true){
					// A blossom can be evolved into a seed
					options.o1=3;
				}
				return;
			}
			// Growing of Stems...
			// Check if the planned part would grow into an existing plant part
			// currently only the own plant is checked. 
			// TODO: Other plants need to be added here
			checkFree(part,flower,'ul','ul','gl',false,hexClickPos);
			checkFree(part,flower,'u' ,'u' ,'gm',false,hexClickPos);
			checkFree(part,flower,'ur','ur','gr',false,hexClickPos);
			// Check if leafes of blossoms can be grown
			if(leafPossible(part).possible){
				// A blossom can be grown
				options.o1=1;
				// A leaf can be grown
				options.o2=1;
			}
			// This option is for the part of the flower in the air
			options.root=false;
		}
		if(root!==undefined){
			if($this.getTime()<root.growStart[root.direction]+root.growDuration[root.direction]){
				// root is not fully grown
				return;
			}
			checkFree(root,roots,'ul','dl','gl',true,hexClickPos);
			checkFree(root,roots,'u' ,'d' ,'gm',true,hexClickPos);
			checkFree(root,roots,'ur','dr','gr',true,hexClickPos);
			// No leaves on roots			
			options.root=true;
		}
	};
	
	function checkFree(part,flower,insideDirection,globalDirection,optionField,isRoot,posFrom){
		var targetField;
		// Check for background obstacles.
		// TODO: Use hexClicPos
		var newHexPos=part.pos;
		if(isRoot===false){
			newHexPos = flower.inverseHexPos(part.pos);
		}
		var targetHexPos=hex.newHexAtDirection(newHexPos,globalDirection);
		hex.add(targetHexPos,{r:0,q:-2});
		var levelField=$this.getLevelHex(targetHexPos).nutrient;
		if(levelField==='X'){
			// Not free, clear option
			options[optionField]=0;
			return;
		}
		
		// Check if a stem in the flower itself already exists
		if(part.here[insideDirection]===0 || part.here.u==='s'){
			// Check if part is free
			targetField=hex.newHexAtDirection(posFrom,globalDirection);
			if(flower.getPartAtPos(targetField,isRoot)===undefined){
				// The target is free
				options[optionField]=1;
				return;
			}
		}
		// No free field found, clear option
		options[optionField]=0;
	}
	
	this.getPartTypeRequirement = function(partType){ //TODO: align with resources file
		var requirement={
				sun      : 0,
				water    : 0,
				nutrient : 0,
		};
		switch (partType) {
		case c.parts.stem:
			requirement.water-=1;
			break;
		case c.parts.root:
			requirement.sun-=1;
			requirement.water+=2;
			requirement.nutrient+=1;
			break;
		case c.parts.leaf:
			requirement.sun+=2;
			requirement.water-=1;
			requirement.nutrient-=1;
			break;
		case c.parts.blossom:
			requirement.water-=2;
			requirement.nutrient-=3;
			break;
		default:
			break;
		}
		return requirement;
	};
	this.decodeWater = function(waterCode){
		switch (waterCode) {
		case '.': // few water
			return 0.15;
			break;
		case ':': // medium water
			return 0.25;
			break;
		case '+': // enough water
			return 0.4;
			break;
		case '*': // refilling water
			return 0.6;
			break;

		default:
			return 0;
			break;
		}
	};
	
	this.checkRequirementFulfilled = function(requirement) {
		requirementFulfilled=resources.checkRequirementFulfilled(requirement);
		return requirementFulfilled;
	};
	
	this.getRequirementFulfilled=function(){
		return requirementFulfilled;
	};
	
	this.updateResources = function() {
		resources.updateResources();
	};
	
	this.updateFlower=function(){
		// Update the flower. This is mainly the animation of growing
		var currentTime=new Date().getTime();
		timedifference=currentTime-oldTime;
		oldTime=currentTime;
	};
	
	this.updateOtherPlants=function() {
		// Update grass and other plants
		
	};
	
	this.updateAnimals=function(){
		animals.updateBees();
	};
	
	this.getTimeDifference=function(){
		return timedifference;
	};
	
	this.getTime=function(){
		return new Date().getTime();
	};
	
	this.updateHelpTexts = function() {
		helpTextsUi.updateHelpTexts();
	};

}