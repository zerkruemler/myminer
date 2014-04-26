describe("Water", function() {

  var level=undefined;
  
  beforeEach(function() {
    level = new Level();
    level.createLevel();
  });

  it("initWater should set water to length 1",function(){
	  var start=level.getStartPoint();
	  level.initWater(start.x, start.y);
	  var water=level.getWater();
	 expect(water.length).toEqual(1);
  });
  
  it("init + flow should flow to the next field", function() {
	  var start=level.getStartPoint();
	  level.initWater(start.x, start.y);
	  var water=level.getWater();
	  level.flow();
	 expect(water.length).toEqual(2);
  });

});