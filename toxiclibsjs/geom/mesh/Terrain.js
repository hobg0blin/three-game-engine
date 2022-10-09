/**
 * Implementation of a 2D grid based heightfield with basic intersection
 * features and conversion to {@link TriangleMesh}. The terrain is always
 * located in the XZ plane with the positive Y axis as up vector.
 */

	//toxi.geom.mesh.Terrain is in meshCommon to avoid circular dependencies
	module.exports = require('./meshCommon').Terrain;
