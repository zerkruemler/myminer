function Buttons(){

	var buttons = [];
	var model=undefined;
	var redrawNeeded=false;
	var $this=this;


	this.reset = function(gameModel){
    	buttons=[];
    	model=gameModel;
        model.registerEvent('buttonSelection',selectButton);
    };

	this.removeAll = function(gameModel){
    	buttons=[];
	};

	this.requireRedraw = function(){
		redrawNeeded=true;		
	};
	this.getRedrawNeeded = function(){
		needed=redrawNeeded;
		redrawNeeded=false;
		return needed;
	};
	
    this.getButtons=function(){
    	return buttons;
    };
    this.addButton = function(iSpec) {
        var spec = {};
        spec.id = iSpec.id;
        spec.text = iSpec.text;
        spec.x = iSpec.x;
        spec.y = iSpec.y;
        spec.sx = iSpec.sx || 1;
        spec.sy = iSpec.sy || 1;
        spec.selected = iSpec.selected || false;
        spec.group = iSpec.group || 0;
        spec.invisible = iSpec.invisible || false;
        spec.icon = iSpec.icon;
        spec.locked = iSpec.locked || false;
        spec.callback = iSpec.callback || function(){};
        buttons.push(spec);
        $this.requireRedraw();
    };
    function selectButton(number){
//    	var buttons = model.getButtons().getButtons();
        $this.requireRedraw();
    	var callback=undefined;
    	for (var i = 0; i < buttons.length; i++) {
    		if(buttons[i].id==number){
    			buttons[i].selected=true;
    			callback=i;
    		}
    		buttons[i].selected=false;
		}
    	if(callback!==undefined){
    		buttons[callback].callback(number);
    	}

    }
}    
