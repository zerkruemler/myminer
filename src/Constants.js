var c={
    CANVAS_SIZE_X : 750,
    CANVAS_SIZE_Y : 625,
    
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
//    		shadowSelected     : "#EE3733",    			
    	},
    	gauge:{
    		background         : "#c0FFc0",
    		border			   : "#008000",
    		bar                : "#00FF00",
    		needed             : "#c08000",
    		waterNeeded        : "#7080a0",
    		water              : "#1020f0",
    		sunNeeded          : "#a0a070",
    		sun                : "#e0e010",
    		nutrient1          : "#f01010",
    		nutrient2          : "#f020f0",
    		nutrient3          : "#800080",
    		nutrient1Needed    : "#a07070",
    		nutrient2Needed    : "#a080a0",
    		nutrient3Needed    : "#704070",
    	},
    	flower:{
    		grass              : "#10E000",
    		stem               : "#00FF00",
    		root               : "#a0a000",
    		seed               : "#B08080",
    		flash              : "#FFFF00", // Seed effect
    		blossom1           : "#f08000",
    		blossomPollenized  : "#ffff00",  // Pollenized Flower
    		blossom2           : "#ff0000",
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
    	options:{
    		arrow              : "#ee22ee",
    		text               : "#ee22ee",
    		textSelected       : "#e00000",
    		background         : "#886688",
    		backgroundSelected : "#442244",
    		backgroundFulfilled : "#77ee77",
    		backgroundNotFulfilled : "#ee7777",
//    		backgroundSelected : "#b0b033",
    		
    		backgroundLocked   : "#999999",
    		border             : "#558855",
    		borderSelected     : "#AAFFAA",
    	},

    },
	buttons:{
		start     : 1,
		garden    : 2,
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
    
    parts:{
    	seed    : 'seed',
    	sprout  : 'sprout',
    	stem    : 'stem',
    	root    : 'root',
    	leaf    : 'leaf',
    	blossom : 'blossom',
    },
    growtime:{
    	stem   : 2000,  // 2 seconds to grow (half) a stem
    	sprout : 4000,  // sprouting time
    	leaf   :10000,  //10 seconds to grow a leaf
    	bud    : 9000,  // Grow a new bud
    	blossom: 8000,  // From bud to blossom 
    	seed   : 4000,  // From Blossom to seed
    },
    level:{
    	background:{
    		pot        :1,
    		emptyGround:2,	
    	}
    }
	
}; 