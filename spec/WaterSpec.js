describe("Water", function() {

  var level=undefined;
  var start=undefined;
  
  beforeEach(function() {
    level = new Level();
    level.createLevel();
    start=level.getStartPoint();
	level.initWater(start.x, start.y);
  });

  it("initWater should set water to length 1",function(){
	  var water=level.getWater();
	 expect(water.length).toEqual(1);
  });
  
  it("get around should return the field below only",function(){
	  var around=level.getFreeAround(start.x, start.y);
	  expect(around.length).toEqual(1);
	  expect(around[0].x).toEqual(start.x);
	  expect(around[0].y).toEqual(start.y+1);
  });

  it("init + flow should flow to another field", function() {
	  var water=level.getWater();
	  level.flow();
	expect(water.length).toEqual(2);
	expect(water[1].x).toEqual(start.x);
	expect(water[1].y).toEqual(start.y+1);
  });
  it("init + flow twice should flow to the correct field", function() {
	  var water=level.getWater();
	  level.flow();
	  level.flow();
	expect(water.length).toEqual(3);
	expect(water[2].x).toEqual(start.x);
	expect(water[2].y).toEqual(start.y+2);
  });
  it("init + flow trice should flow to the correct field", function() {
	  var water=level.getWater();
	  level.flow();
	  level.flow();
	  level.flow();
	expect(water.length).toEqual(4);
	expect(water[3].x).toEqual(start.x);
	expect(water[3].y).toEqual(start.y+3);
  });
  

});