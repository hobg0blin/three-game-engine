var internals = require('../../../internals');
var DisplacementSubdivision = require('./DisplacementSubdivision');
	
	var MidpointDisplacementSubdivision = function( centroid, amount ){
		DisplacementSubdivision.call(this, amount);
		this.centroid = centroid;
	};
	internals.extend( MidpointDisplacementSubdivision, DisplacementSubdivision );
	MidpointDisplacementSubdivision.prototype.computeSplitPoints = function( edge ){
		var mid = edge.getMidPoint(),
			n = mid.sub( this.centroid ).normalizeTo( this.amp * edge.getLength() );
		return [ mid.addSelf(n) ];
	};
	module.exports = MidpointDisplacementSubdivision;

    