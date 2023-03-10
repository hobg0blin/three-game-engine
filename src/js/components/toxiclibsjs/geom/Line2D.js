

var	Ray2D = require('./Ray2D'),
	internals = require('../internals'),
    mathUtils = require('../math/mathUtils');


/**
 @class
 @member toxi
 */
var Line2D = function( a, b) {
	this.a = a;
	this.b = b;
};


Line2D.prototype = {
    constructor: Line2D,

    /**
     * Computes the dot product of these 2 vectors: line start -> point
     * and the perpendicular line direction if the result is negative.
     *
     * @param {Vec2D} p
     * @return classifier Number
     */
    classifyPoint: function(p){
        var normal = this.b.sub(this.a).perpendicular();
        var d = p.sub(this.a).dot(normal);
        return mathUtils.sign(d);
    },

	/**
    * Computes the closest point on this line to the point given.
    *
    * @param {Vec2D} p point to check against
    * @return closest point on the line
    */
	closestPointTo: function(p) {
		var v = this.b.sub(this.a);
		var t = p.sub(this.a).dot(v) / v.magSquared();
		// Check to see if t is beyond the extents of the line segment
		if (t < 0.0) {
			return this.a.copy();
		} else if (t > 1.0) {
			return this.b.copy();
		}
		// Return the point between 'a' and 'b'
		return this.a.add(v.scaleSelf(t));
	},

	copy: function() {
		return new Line2D(this.a.copy(), this.b.copy());
	},

    distanceToPoint: function(p){
        return this.closestPointTo(p).distanceTo(p);
    },

    distanceToPointSquared: function(p){
        return this.closestPointTo(p).distanceToSquared(p);
    },

	equals: function(obj) {
		if (this == obj) {
			return true;
		}
		if (!( internals.is.Line2D( obj ) ) ) {
			return false;
		}
		var l = obj;
		return (this.a.equals(l.a) || this.a.equals(l.b)) && (this.b.equals(l.b) || this.b.equals(l.a));
	},

	getDirection: function() {
		return this.b.sub(this.a).normalize();
	},

    getHeading: function(){
        return this.b.sub(this.a).heading();
    },

	getLength: function() {
		return this.a.distanceTo(this.b);
	},

	getLengthSquared: function() {
		return this.a.distanceToSquared(this.b);
	},

	getMidPoint: function() {
		return this.a.add(this.b).scaleSelf(0.5);
	},

	getNormal: function() {
		return this.b.sub(this.a).perpendicular();
	},

	getTheta: function() {
		return this.a.angleBetween(this.b, true);
	},

	hasEndPoint: function(p) {
		return this.a.equals(p) || this.b.equals(p);
	},

	/**
    * Computes intersection between this and the given line. The returned value
    * is a {@link LineIntersection} instance and contains both the type of
    * intersection as well as the intersection point (if existing).
    *
    * Based on: http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/
    *
    * @param l
    *            line to intersect with
    * @return intersection result
    */
	intersectLine: function(l) {

        var Type = Line2D.LineIntersection.Type;

		var isec,
			denom = (l.b.y - l.a.y) * (this.b.x - this.a.x) - (l.b.x - l.a.x) * (this.b.y - this.a.y),
			na = (l.b.x - l.a.x) * (this.a.y - l.a.y) - (l.b.y - l.a.y) * (this.a.x - l.a.x),
			nb = (this.b.x - this.a.x) * (this.a.y - l.a.y) - (this.b.y - this.a.y) * (this.a.x - l.a.x);
		if (denom !== 0) {
			var ua = na / denom,
				ub = nb / denom,
                vecI = this.a.interpolateTo(this.b, ua);

			if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
				isec =new Line2D.LineIntersection(Type.INTERSECTING, vecI, ua, ub);
			} else {
				isec = new Line2D.LineIntersection(Type.NON_INTERSECTING, vecI, ua, ub);
			}
		} else {
			if (na === 0 && nb === 0) {
                if( this.distanceToPoint(l.a) === 0) {
                    isec = new Line2D.LineIntersection(Type.COINCIDENT, undefined);
                } else {
                    isec = new Line2D.LineIntersection(Type.COINCIDENT_NO_INTERSECT, undefined);
                }
			} else {
				isec = new Line2D.LineIntersection(Type.PARALLEL, undefined);
			}
		}
		return isec;
	},

	offsetAndGrowBy: function(offset,scale, ref) {
		var m = this.getMidPoint();
		var d = this.getDirection();
		var n = d.getPerpendicular();
		if (ref !== undefined && m.sub(ref).dot(n) < 0) {
			n.invert();
		}
		n.normalizeTo(offset);
		this.a.addSelf(n);
		this.b.addSelf(n);
		d.scaleSelf(scale);
		this.a.subSelf(d);
		this.b.addSelf(d);
		return this;
	},

	scale: function(scale) {
		var delta = (1 - scale) * 0.5;
		var newA = this.a.interpolateTo(this.b, delta);
		this.b.interpolateToSelf(this.a, delta);
		this.a.set(newA);
		return this;
	},

	set: function(a, b) {
		this.a = a;
		this.b = b;
		return this;
	},

	splitIntoSegments: function(segments,stepLength,addFirst) {
		return Line2D.splitIntoSegments(this.a, this.b, stepLength, segments, addFirst);
	},

	toRay2D: function() {
        var Ray2D = require('./Ray2D');
		return new Ray2D(this.a.copy(), this.b.sub(this.a).normalize());
	}
};



/**
 * Splits the line between A and B into segments of the given length,
 * starting at point A. The tweened points are added to the given result
 * list. The last point added is B itself and hence it is likely that the
 * last segment has a shorter length than the step length requested. The
 * first point (A) can be omitted and not be added to the list if so
 * desired.
 *
 * @param a start point
 * @param b end point (always added to results)
 * @param stepLength desired distance between points
 * @param segments existing array list for results (or a new list, if null)
 * @param addFirst false, if A is NOT to be added to results
 * @return list of result vectors
 */
Line2D.splitIntoSegments = function(a, b, stepLength, segments, addFirst) {
	if (segments === undefined) {
		segments = [];
	}
	if (addFirst) {
		segments.push(a.copy());
	}
	var dist = a.distanceTo(b);
	if (dist > stepLength) {
		var pos = a.copy();
		var step = b.sub(a).limit(stepLength);
		while (dist > stepLength) {
			pos.addSelf(step);
			segments.push(pos.copy());
			dist -= stepLength;
		}
	}
	segments.push(b.copy());
	return segments;
};


/**
 * Internal class for LineIntersection
 * @param {Number} type one of the Line2D.LineIntersection.Type
 * @param {Vec2D} pos the intersected point
 * @param {Number} ua coefficient
 * @param {Number} ub coefficient
 */
Line2D.LineIntersection = function(type, pos, ua, ub) {
	this.type = type;
	this.pos = pos;
    this.coeff = [ua, ub];
};

Line2D.LineIntersection.prototype = {
	getPos: function(){
		return this.pos ? this.pos.copy() : undefined;
	},

    getCoefficients: function(){
        return this.coeff;
    },

	getType: function(){
		return this.type;
	},

	toString: function(){
		return "type: "+this.type+ " pos: "+this.pos;
	}
};

Line2D.LineIntersection.Type = {
    COINCIDENT: 0,
	COINCIDENT_NO_INTERSECT: 4,
    PARALLEL: 1,
    NON_INTERSECTING: 2,
	INTERSECTING: 3,
};


module.exports = Line2D;

