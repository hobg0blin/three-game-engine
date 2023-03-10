

    var Vec2D = require('../../geom/Vec2D');

    var	ConstantForceBehavior = function(force){
        this.force = force;
        this.scaledForce = new Vec2D();
        this.timeStep = 0;
    };

    ConstantForceBehavior.prototype = {
        applyBehavior: function(p){ //apply() is reserved, so this is now applyBehavior
            p.addForce(this.scaledForce);
        },

        configure: function(timeStep){
            this.timeStep = timeStep;
            this.setForce(this.force);
        },

        getForce: function(){
            return this.force;
        },

        setForce: function(forceVec){
            this.force = forceVec;
            this.scaledForce = this.force.scale(this.timeStep);
        },

        toString: function(){
            return "behavior force: "+ this.force+ " scaledForce: "+this.scaledForce+ " timeStep: "+this.timeStep;
        }
    };

    module.exports = ConstantForceBehavior;

