

var extend = require('../internals').extend,
	Vec2D = require('./Vec2D'),
	Line2D = require('./Line2D');

/**
* Ray2D accepts 2 formats for its constructor
* Option 1:
* @param {Number} x,
* @param {Number} y,
* @param {toxi.geom.Vec2D} direction
*
* Option 2:
* @param {toxi.geom.Vec2D} position
* @param {toxi.geom.Vec2D} direction
*/
var	Ray2D = function(a,b,d){
	var o, dir;
	if(arguments.length == 3){
		Vec2D.apply(this,[a,b]);
		this.dir = d.getNormalized();
	} else if(arguments.length == 2){
		Vec2D.apply(this,[a]);
		this.dir = b.getNormalized();
	} else if(arguments.length === 0){
		Vec2D.apply(this);
		this.dir = Vec2D.Y_AXIS.copy();
	}
};
extend(Ray2D,Vec2D);

Ray2D.prototype.getDirection = function() {
	  return this.dir.copy();
};
/**
 * Calculates the distance between the given point and the infinite line
 * coinciding with this ray.
 */
Ray2D.prototype.getDistanceToPoint = function(p) {
	var sp = p.sub(this);
	return sp.distanceTo(this.dir.scale(sp.dot(this.dir)));
};

Ray2D.prototype.getPointAtDistance = function(dist) {
	return this.add(this.dir.scale(dist));
};

/**
 * Uses a normalized copy of the given vector as the ray direction.
 *
 * @param d new direction
 * @return itself
 */
Ray2D.prototype.setDirection = function(d) {
	this.dir.set(d).normalize();
	return this;
};

/**
 * Converts the ray into a 2D Line segment with its start point coinciding
 * with the ray origin and its other end point at the given distance along
 * the ray.
 *
 * @param dist end point distance
 * @return line segment
 */
Ray2D.prototype.toLine2DWithPointAtDistance = function(dist) {
	var Line2D = require('./Line2D');
	return new Line2D(this, this.getPointAtDistance(dist));
};

Ray2D.prototype.toString = function() {
	return "origin: " + Vec2D.prototype.toString.apply(this) + " dir: " + this.dir;
};

module.exports = Ray2D;

