

var internals = require('../internals'),
	Vec2D = require('../geom/Vec2D');

var	VerletParticle2D = function(x,y,w){
	this.force = new Vec2D();
	if( internals.has.XY( x ) ){
		if( internals.is.VerletParticle2D( x ) ){

			y = x.y;
			w = x.weight;
			x = x.x;
			this.isLocked = x.isLocked;

		} else if(y === undefined){
			y = x.y;
			w = 1;
			x = x.x;
		} else {
			w = y;
			y = x.y;
			x = x.x;
		}
	}
	Vec2D.call(this, x,y);
	this.isLocked = false;
	this.prev = new Vec2D(this);
	this.temp = new Vec2D();
	w = w || 1;
	this.setWeight(w);
};

internals.extend(VerletParticle2D,Vec2D);

VerletParticle2D.prototype.addBehavior = function(behavior,timeStep){
	if(this.behaviors === undefined){
		this.behaviors = [];
	}
	if(behavior === undefined){
		throw new Error("behavior was undefined");
	}
	timeStep = (timeStep === undefined)? 1 : timeStep;
	behavior.configure(timeStep);
	this.behaviors.push(behavior);
	return this;
};

VerletParticle2D.prototype.addConstraint = function(c){
	if(this.constraints === undefined){
		this.constraints = [];
	}
	this.constraints.push(c);
	return this;
};

VerletParticle2D.prototype.addForce = function(f){
	this.force.addSelf(f);
	return this;
};

VerletParticle2D.prototype.addVelocity = function(v){
	this.prev.subSelf(v);
	return this;
};

VerletParticle2D.prototype.applyBehaviors = function(){
	if(this.behaviors !== undefined){
		var i = 0, len = this.behaviors.length;
		for(i = 0;i<len;i++){
			this.behaviors[i].applyBehavior(this);
		}
	}
};

VerletParticle2D.prototype.applyConstraints = function(){
	if(this.constraints !== undefined){
		var i = 0, len = this.constraints.length;
		for(i =0;i<len;i++){
			this.constraints[i].applyConstraint(this);
		}
	}
};


VerletParticle2D.prototype.clearForce = function(){
	this.force.clear();
	return this;
};

VerletParticle2D.prototype.clearVelocity = function(){
	this.prev.set(this);
	return this;
};

VerletParticle2D.prototype.getInvWeight = function(){
	return this.invWeight;
};

VerletParticle2D.prototype.getPreviousPosition = function(){
	return this.prev;
};

VerletParticle2D.prototype.getVelocity = function(){
	return this.sub(this.prev);
};

VerletParticle2D.prototype.getWeight = function(){
	return this.weight;
};

VerletParticle2D.prototype.lock = function(){
	this.isLocked = true;
	return this;
};

VerletParticle2D.prototype.removeAllBehaviors = function(){
	this.behaviors = [];
	return this;
};

VerletParticle2D.prototype.removeAllConstraints = function(){
	this.constraints = [];
	return this;
};

VerletParticle2D.prototype.removeBehavior = function(b){
	return internals.removeItemFrom(b,this.behaviors);
};

VerletParticle2D.prototype.removeConstraint = function(c){
	return internals.removeItemFrom(c,this.constraints);
};

VerletParticle2D.prototype.scaleVelocity = function(scl){
	this.prev.interpolateToSelf(this,1 - scl);
	return this;
};

VerletParticle2D.prototype.setPreviousPosition = function(p){
	this.prev.set(p);
	return this;
};

VerletParticle2D.prototype.setWeight = function(w){
	this.weight = w;
	this.invWeight = (w !== 0) ? 1 / w : 0; //avoid divide by zero
};

VerletParticle2D.prototype.unlock = function() {
	this.clearVelocity();
	this.isLocked = false;
	return this;
};

VerletParticle2D.prototype.update = function(){

	if(!this.isLocked){
		this.applyBehaviors();
		//applyForce() - inline
        this.temp.set(this);
        this.addSelf(this.sub(this.prev).addSelf(this.force.scale(this.weight)));
        this.prev.set(this.temp);
        this.force.clear();
        //
		this.applyConstraints();
	}
};

module.exports = VerletParticle2D;

