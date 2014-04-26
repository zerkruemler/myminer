var c={
    CANVAS_SIZE_X : 600, //3
    CANVAS_SIZE_Y : 400, //2
    
    color:{
    	text        : "#000000",
    	textOutline : "#202050",
    	
    	button:{
    		text               : "#eeee22",
    		textSelected       : "#e00000",
    		background         : "#3333AA",
    		backgroundSelected : "#7777ee",
    		backgroundLocked   : "#999999",
    		border             : "#555588",
    		borderSelected     : "#AAAAFF",
    	},
    	background:{
        	game               : "#C0C0FF",
    		earth              : "#601000",
    		pot                : "#902000",
    		pot2               : "#b04000",
    		sky                : "#4050fF",
    		sun                : "#E0E000",
    		windowsill         : "#504040",
    	},

    },
	buttons:{
		start     : 1,
		//
		toTitle     :100,
		toNextLevel :101,

		// 200: Level Buttons
		// cheat
		startFast : 301,
		startFastResource : 302,
		startResource : 303,
		startFastResourceBee : 304,

	},
    KEY: {
    	UP: 38,
    	DOWN: 40,
    	LEFT: 37,
    	RIGHT: 39,
    	Q:81,
    	W:87,
    	E:69,
    	A:65,
    	S:83,
    	D:68,
    	SPACE:32,
    	ENTER:13,
    },
    DIRECTION : {
    	UP: 1,
    	DOWN: 2,
    	LEFT: 3,
    	RIGHT: 4,
    	BUTTON: 5,
    },
	
}; 