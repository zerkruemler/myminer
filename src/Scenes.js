function Scenes(){
	
	
	var currentScene = undefined;
	var allScenes = {};
	var regularIntervalId = undefined;
	
	this.reset = function(){
		
	};
	
	this.addScene = function(sceneObject){
		sceneObject.exit=sceneObject.exit||function(){};
		sceneObject.start=sceneObject.start||function(){};
		sceneObject.regularCallback=sceneObject.regularCallback||function(){};
		allScenes[sceneObject.name]=sceneObject;
	};
	this.setScene = function(newScene){
		if(currentScene){
			allScenes[currentScene].exit();
			clearInterval(regularIntervalId);
		}
		currentScene=newScene;
		allScenes[currentScene].start();
		
		// Register regular callback
		regularIntervalId=setInterval(
				function(){
					allScenes[currentScene].regularCallback.apply(allScenes[currentScene]);
				},
				16); //160
		
	};

	this.redraw = function(gameView){
		allScenes[currentScene].redraw(gameView);
	};
	
}