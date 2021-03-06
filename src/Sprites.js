function Sprites() {

	var sprites = {
		playerWalk0 : {
			path : 'player-walk0'
		},
		playerWalk1 : {
			path : 'player-walk1'
		},
		playerWalk2 : {
			path : 'player-walk2'
		},
		drill1 : {
			path : 'drill1'
		},
		drill2 : {
			path : 'drill2'
		},
		a : {
			path : 'a'
		},
		b : {
			path : 'b'
		},
		c : {
			path : 'c'
		},
		d : {
			path : 'd'
		},
		e : {
			path : 'e'
		},
		f : {
			path : 'f'
		},
		g : {
			path : 'g'
		},
		h : {
			path : 'h'
		},
		i : {
			path : 'i'
		},
	};

	this.loadSprites = function(callback) {
		var toLoad=0;
		// load all game images here
		for ( var spriteName in sprites) {
			var sprite = sprites[spriteName];
			sprite.image = loadImage('sprites/'+sprite.path + '.png');
			toLoad++;
		}
		var loading = setInterval(function(){
			for ( var spriteName in sprites) {
				var sprite = sprites[spriteName].image;
				if(sprite.complete && !sprite.counted){
					toLoad--;
					sprite.counted=true;
				};
			};
			if(toLoad==0){
				clearInterval(loading);
				callback();
			}
		},200);
	};

	this.getSprite = function(name) {
		return sprites[name];
	};

	function loadImage(name) {
		// create new image object
		var image = new Image();
		// load image
		image.src = name;
		// return image object
		return image;
	}
}