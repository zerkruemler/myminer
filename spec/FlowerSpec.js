describe("Flower", function() {

  var flower=undefined;
  
  beforeEach(function() {
    flower = new Flower();
    model  = {
    		getTime:function(){}
    };
  });

  it("get Flower returns an array",function(){
	 var flowerData = flower.getFlower();
	 expect(flowerData.length).toEqual(0);
  });
  
  it("Plant seed should create a seed", function() {
	  flower.plantSeed(model);
	  var flowerData = flower.getFlower();
	  expect(flowerData.length).toEqual(1);
	  expect(flowerData[0].here.c).toEqual(5);
  });

  it("part.info can identify a closed seed",function(){
	  var part=flower.plantSeed(model);
	  expect(part.info()).toEqual(c.parts.seed);
  });
  it("part.info can identify a sprout",function(){
	  var part=flower.plantSeed(model);
	  flower.sprout(part);
	  expect(part.info()).toEqual(c.parts.sprout);
  });
  
  // Sprout
  it("Sprout should throw an error when no seed exitst",function(){
	  expect(flower.sprout).toThrow(new Error("This is not a seed"));
  });

  it("Sprout should change the seed",function(){
	  var seed=flower.plantSeed(model);
	  flower.sprout(seed);
	  var flowerData = flower.getFlower();
	  expect(flowerData.length).toEqual(1);     // No additional Part should be created
	  expect(flowerData[0].here.c).toEqual(4);  // The seed changes
  });

  it("Sprout should throw an error when seed is already sprouted",function(){
	  flower.plantSeed(model);
	  flower.sprout();
	  expect(flower.sprout).toThrow(new Error("sprouting only possible on unsproutes seeds"));
  });

  it("growTo (up) should throw an error when seed is not sprouted",function(){
	  flower.plantSeed(model);
	  var flowerData = flower.getFlower();
	  var grow=function(){
		  flower.growTo(model,flowerData[0],'u');
	  };
	  expect(grow).toThrow(new Error("growTo not possible on seed"));
  });

  describe("growing", function() {

	  var flower=undefined;
	  var flowerData = undefined;
	  var model = {
			  getTime:function(){}
	  };
	  var part=undefined;
	  
	  beforeEach(function() {
	    flower = new Flower();
	    flower.plantSeed(model);
	    part=flower.sprout();
		flowerData = flower.getFlower();

	  });  
	  // Growing
	  it("GrowTo should throw an error when direction is not valid",function(){
		  var grow=function(){
			  flower.growTo(model,part,'');
		  };
		  expect(grow).toThrow(new Error('Unknown direction'));
	  });
	  
	  it("GrowTo (up) should create a new flower part",function(){
		  flower.growTo(model,part,'u');
		  expect(flowerData.length).toEqual(2);
	  });
	  it("GrowTo (up) should create the new flower part above the existing",function(){
		  var part2=flower.growTo(model,part,'u');
		  expect(flowerData.length).toEqual(2);
		  expect(part2.here.d).toEqual(1);
	  });

	  it("GrowTo (up) should grow the stem to the direction of the next part",function(){
		  flower.growTo(model,part,'u');
		  expect(part.here.u).toEqual(1);
	  });
	  
	  it("GrowTo (up) two times grows further",function(){
		  var seed=part;
		  var stem1 = flower.growTo(model,seed,'u');
		  var stem2 = flower.growTo(model,stem1,'u');
		  expect(flowerData.length).toEqual(3);
		  
		  expect(seed.here.u).toEqual(2);
		  expect(stem1.here.d).toEqual(2);
		  expect(stem1.here.u).toEqual(1);
		  expect(stem2.here.d).toEqual(1);
		  expect(stem2.here.u).toEqual(0);
	  });
	  it("GrowTo where already a brach exists throws an error",function(){
		  var from=flower.growTo(model,part,'u');
		  flower.growTo(model,from,'u');

		  var grow=function(){
			  flower.growTo(model,from,'u');
		  };
		  expect(grow).toThrow(new Error('branch already exists'));
	  });

	  it("GrowTo (up) three times thickens the stem",function(){
		  var seed=part;
		  var stem1=flower.growTo(model,seed,'u');
		  var stem2=flower.growTo(model,stem1,'u');
		  var stem3=flower.growTo(model,stem2,'u');
		  expect(flowerData.length).toEqual(4);
		  
		  expect(seed.here.u).toEqual(3);
		  expect(stem1.here.d).toEqual(3);
		  expect(stem1.here.u).toEqual(2);
		  expect(stem2.here.d).toEqual(2);
		  expect(stem2.here.u).toEqual(1);
		  expect(stem3.here.d).toEqual(1);
		  expect(stem3.here.u).toEqual(0);
	  });
	  
	  it("GrowTo all directions three times thickens the stem",function(){
		  var seed=part;
		  var stem1=flower.growTo(model,seed,'ur');
		  var stem2=flower.growTo(model,stem1,'u');
		  var stem3=flower.growTo(model,stem2,'ul');
		  expect(flowerData.length).toEqual(4);
		  // Grows:
		  //   
		  // 1  \   stem3
		  
		  // 1   \  stem2
		  // 2    |

		  // 2    | stem1
		  // 3   /
		  
		  // 3  /   Seed
		  //   *
		  expect(seed.here.ur).toEqual(3);
		  expect(stem1.here.dl).toEqual(3);
		  expect(stem1.here.u).toEqual(2);
		  expect(stem2.here.d).toEqual(2);
		  expect(stem2.here.ul).toEqual(1);
		  expect(stem3.here.dr).toEqual(1);
	  });
	  it("GrowTo a tree with multiple branches and check",function(){
		  var seed=part;
		  var stem1=flower.growTo(model,seed,'u');
		  var stem2=flower.growTo(model,stem1,'u');
		  var stem2a=flower.growTo(model,stem1,'ur');
		  var stem3=flower.growTo(model,stem2,'ul');
		  expect(flowerData.length).toEqual(5);
		  // Grows:
		  //   
		  //1\    stem3  
		  
		  //1 \   stem2
		  //2  |  /  stem2a
		  
		  //2  |/  stem1
		  //3  |
		  
		  //3 \|/  seed
		  //   *
		  expect(seed.here.u).toEqual(3);
		  
		  expect(stem1.here.d).toEqual(3);
		  expect(stem1.here.u).toEqual(2);
		  
		  expect(stem2.here.d).toEqual(2);
		  expect(stem2.here.ul).toEqual(1);
		  
		  expect(stem1.here.ur).toEqual(1);
		  expect(stem2a.here.dl).toEqual(1);
		  
		  expect(stem3.here.dr).toEqual(1);
	  });
	  it("GrowTo a tree with longer second branch and check",function(){
		  var seed=part;
		  var stem1=flower.growTo(model,seed,'u');
		  var stem2=flower.growTo(model,stem1,'u');
		  var stem2a=flower.growTo(model,stem1,'ur');
		  var stem3=flower.growTo(model,stem2a,'u');
		  expect(flowerData.length).toEqual(5);
		  // Grows:
		  //   
		  //1      | stem3 1
		  
		  //  st2  |        1
		  //1  |  /  stem2a 2
		  
		  //1  |/  stem1    2
		  //3  |
		  
		  //3 \|/  seed
		  //   *
		  expect(seed.here.u).toEqual(3);
		  
		  expect(stem1.here.d).toEqual(3);
		  expect(stem1.here.u).toEqual(1);
		  
		  expect(stem2.here.d).toEqual(1);
		  
		  expect(stem1.here.ur).toEqual(2);
		  expect(stem2a.here.dl).toEqual(2);
		  expect(stem2a.here.u).toEqual(1);

		  expect(stem3.here.u).toEqual(0);
		  expect(stem3.here.d).toEqual(1);
	  });
	  
  }); // Describe growing

  describe("growing roots", function() {

	  var flower=undefined;
	  var part=undefined;
	  
	  beforeEach(function() {
	    flower = new Flower();
	    flower.plantSeed(model);
		part=flower.sprout();

	  });  
	  // Growing
	  it("should throw an error when growing an already grown direction",function(){
		  var grow=function(){
			  flower.growTo(model,part,'u');
		  };
		  flower.growTo(model,part,'u');
		  expect(grow).toThrow(new Error('branch already exists'));
	  });
  });
	  
  describe("top", function() {
	  var flower=undefined;
	  var part=undefined;
	  
	  beforeEach(function() {
	    flower = new Flower();
	    part=flower.plantSeed(model);
	  });
		
	  it("should be the seed on start",function(){
		  expect(part.pos.r).toBe(0);
		  expect(part.pos.q).toBe(0);
		  expect(part.info()).toEqual(c.parts.seed);
	  });

	  it("should be the sprout after sprouting",function(){
		  part=flower.sprout();
		  expect(part.pos.r).toBe(0);
		  expect(part.pos.q).toBe(0);
		  expect(part.info()).toEqual(c.parts.sprout);
	  });
	  
	  it("should be the topmost part of the plant",function(){
		  var flowerData = flower.getFlower();		  
		  flower.sprout();
		  part=flower.growTo(model,flowerData[0],'u');
		  expect(part.pos.r).toBe(0);
		  expect(part.pos.q).toBe(-1); // up is negative
		  expect(part.info()).toEqual(c.parts.stem);
	  });
  
  }); // Top of flower
  
//  it("Sprout should throw an error when no seed exitst",function(){
//	  
//  });

});