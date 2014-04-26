function ButtonsUi() {

	
	var buttonsModel=undefined;
	var view=undefined;
	
	this.reset = function(buttons,gameView){
		buttonsModel=buttons;
		view=gameView;
		buttonsModel.requireRedraw();
	};
	
    this.drawAll = function(){
    	if(buttonsModel.getRedrawNeeded()===true){
    		view.layerUi();
    		var buttons = buttonsModel.getButtons();
    		for (var i = 0; i < buttons.length; i++) {
    			this.drawButton(buttons[i]);
    		};
    	}
    };

    this.drawButton = function(button) {
        
        var text = button.text;
        var x  = button.x;
        var y  = button.y;
        var sx = button.sx;
        var sy = button.sy;
        
        var textColor;
        var borderColor;
        var fillColor;

        if(button.invisible){
        	return;
        }
        if(button.selected){
            borderColor = c.color.button.borderSelected;
            fillColor = c.color.button.backgroundSelected;
            textColor= c.color.button.textSelected;
        }else{     
            borderColor = c.color.button.border;
            fillColor = c.color.button.background;
            textColor= c.color.button.text;
        }
		if(button.locked){
            fillColor = c.color.button.backgroundLocked;
		}

        if(button.icon){
//            stage.fillStyle = c.BUTTON.SELECTED_BACKGROUND_COLOR;
//	        stage.fillRect(x,y,sx,sy);
//        	canvas.drawImage(button.icon,x/5,y/5,sx/5,sy/5);
//	        stage.strokeRect(x,y,sx,sy);
        }else{
        	// Draw the button
        	view.setFill(fillColor);
        	view.setStroke(borderColor);
        	view.fillRect(x,y,sx,sy);
	        view.strokeRect(x,y,sx,sy);
       	
        	view.setFill(textColor);
        	view.text({
        		text: text,
        		x   : x+sx/2,
        		y   : y+sy-1.5,
        		center : true
        	});
        }
    };

    this.checkClicked = function(mouse) {
    	var buttons = buttonsModel.getButtons();
    	// Checks which button was clicked. Also supports radio button groups
        var button = this.getClicked(mouse);
        if (!button) {
            return undefined;
        }
        if(button.invisible==true){
        	return undefined;
        } 
        // Radio button logic
        if (button.group) {
            button.selected=true;
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].group == button.group && button.id!=buttons[i].id) {
                    buttons[i].selected=false;
                };
            };
        };
        return button;
    };

    this.getClicked = function(mouse) {
    	var buttons = buttonsModel.getButtons();
    	// Check which button was clicked
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].locked==false && view.checkButtonClicked(buttons[i], mouse)) {
                return buttons[i];
            };
        };
        return undefined;
    };

//    this.screenToCoord=function(posIn){
//    	return {
//    		x:posIn.x/blocksize,
//    		y:posIn.y/blocksize,
//    	};
//    };
};
