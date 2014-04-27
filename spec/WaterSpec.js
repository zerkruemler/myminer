describe("Water", function() {

  var level=undefined;
  var start=undefined;
  
  beforeEach(function() {
    level = new Level();
    level.createLevel();
  });

  describe("from above", function() {

	  beforeEach(function() {
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
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(2);
		  expect(water[1].x).toEqual(start.x);
		  expect(water[1].y).toEqual(start.y+1);
	  });
	  it("init + flow twice should flow to the correct field", function() {
		  level.flow();
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(3);
		  expect(water[2].x).toEqual(start.x);
		  expect(water[2].y).toEqual(start.y+2);
	  });
	  it("init + flow trice should flow to the correct field", function() {
		  level.flow();
		  level.flow();
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(4);
		  expect(water[3].x).toEqual(start.x);
		  expect(water[3].y).toEqual(start.y+3);
	  });
	  it("init + add a tunnel to the right + flow should flow to the correct field", function() {
		  level.setTunnel(start.x+1, start.y);
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(3);
		  expect(water[1].x).toEqual(start.x+1);
		  expect(water[1].y).toEqual(start.y);
		  expect(water[2].x).toEqual(start.x);
		  expect(water[2].y).toEqual(start.y+1);
	  });
	  it("init + add a tunnel to the left and right + flow should flow to the correct field", function() {
		  var water=level.getWater();
		  level.setTunnel(start.x+1, start.y);
		  level.setTunnel(start.x-1, start.y);
		  level.flow();
		  expect(water.length).toEqual(4);
		  expect(water[1].x).toEqual(start.x-1);
		  expect(water[1].y).toEqual(start.y);
		  expect(water[2].x).toEqual(start.x+1);
		  expect(water[2].y).toEqual(start.y);
		  expect(water[3].x).toEqual(start.x);
		  expect(water[3].y).toEqual(start.y+1);
	  });
	});
  describe("from below", function() {

	  beforeEach(function() {
		  start=level.getStartPoint();
		  start.y=level.getLevelSize().y-1;
		  level.initWater(start.x, start.y);
	  });

	  it("initWater should set water to length 1",function(){
		  var water=level.getWater();
		 expect(water.length).toEqual(1);
	  });
	  it("init + flow should flow to the correct field", function() {
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(2);
		  expect(water[1].x).toEqual(start.x);
		  expect(water[1].y).toEqual(start.y-1);
	  });
	  it("init + tunnel right + flow should flow to the correct field", function() {
		  level.setTunnel(start.x+1, start.y);
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(2);
		  expect(water[1].x).toEqual(start.x+1);
		  expect(water[1].y).toEqual(start.y);
	  });
	  it("init + tunnel right + twice flow should flow to the correct field", function() {
		  level.setTunnel(start.x+1, start.y);
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(2);
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(3);
		  expect(water[2].x).toEqual(start.x);
		  expect(water[2].y).toEqual(start.y-1);
	  });
	  it("init + tunnel right + left + flow should flow to the correct field", function() {
		  level.setTunnel(start.x+1, start.y);
		  level.setTunnel(start.x-1, start.y);
		  level.flow();
		  var water=level.getWater();
		  expect(water.length).toEqual(3);
		  expect(water[1].x).toEqual(start.x-1);
		  expect(water[1].y).toEqual(start.y);
		  expect(water[2].x).toEqual(start.x+1);
		  expect(water[2].y).toEqual(start.y);
	  });
  });
});