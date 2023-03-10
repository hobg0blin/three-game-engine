var internals = require('../../../internals');
var SubdivisionStrategy = require('./SubdivisionStrategy');

	var DualSubdivision = function(){
		SubdivisionStrategy.call(this);
	};
	internals.extend( DualSubdivision, SubdivisionStrategy );
	DualSubdivision.prototype.computeSplitPoints = function( edge ){
		return [ edge.a.interpolateTo(edge.b, 0.3333333333333333), edge.a.interpolateTo(edge.b, 0.6666666666666666) ];
	};
	module.exports = DualSubdivision;
