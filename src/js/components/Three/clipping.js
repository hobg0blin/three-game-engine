import * as THREE from 'three';
  function planesFromMesh( vertices, indices ) {

				// creates a clipping volume from a convex triangular mesh
				// specified by the arrays 'vertices' and 'indices'

				const n = indices.length / 3,
					result = new Array( n );

				for ( let i = 0, j = 0; i < n; ++ i, j += 3 ) {

					const a = vertices[ indices[ j ] ],
						b = vertices[ indices[ j + 1 ] ],
						c = vertices[ indices[ j + 2 ] ];

					result[ i ] = new THREE.Plane().
						setFromCoplanarPoints( a, b, c );

				}

				return result;

			}

			function createPlanes( n ) {

				// creates an array of n uninitialized plane objects

				const result = new Array( n );

				for ( let i = 0; i !== n; ++ i )
					result[ i ] = new THREE.Plane();

				return result;

			}

			function assignTransformedPlanes( planesOut, planesIn, matrix ) {

				// sets an array of existing planes to transformed 'planesIn'

				for ( let i = 0, n = planesIn.length; i !== n; ++ i )
					planesOut[ i ].copy( planesIn[ i ] ).applyMatrix4( matrix );

			}

			function cylindricalPlanes( n, innerRadius ) {

				const result = createPlanes( n );

				for ( let i = 0; i !== n; ++ i ) {

					const plane = result[ i ],
						angle = i * Math.PI * 2 / n;

					plane.normal.set(
						Math.cos( angle ), 0, Math.sin( angle ) );

					plane.constant = innerRadius;

				}

				return result;

			}

			const planeToMatrix = ( function () {

				// creates a matrix that aligns X/Y to a given plane

				// temporaries:
				const xAxis = new THREE.Vector3(),
					yAxis = new THREE.Vector3(),
					trans = new THREE.Vector3();

				return function planeToMatrix( plane ) {

					const zAxis = plane.normal,
						matrix = new THREE.Matrix4();

					// Hughes & Moeller '99
					// "Building an Orthonormal Basis from a Unit Vector."

					if ( Math.abs( zAxis.x ) > Math.abs( zAxis.z ) ) {

						yAxis.set( - zAxis.y, zAxis.x, 0 );

					} else {

						yAxis.set( 0, - zAxis.z, zAxis.y );

					}

					xAxis.crossVectors( yAxis.normalize(), zAxis );

					plane.coplanarPoint( trans );
					return matrix.set(
						xAxis.x, yAxis.x, zAxis.x, trans.x,
						xAxis.y, yAxis.y, zAxis.y, trans.y,
						xAxis.z, yAxis.z, zAxis.z, trans.z,
						0,	 0, 0, 1 );

				};

			} )()
		function setObjectWorldMatrix( object, matrix, scene ) {

				// set the orientation of an object based on a world matrix

				const parent = object.parent;
				scene.updateMatrixWorld();
				object.matrix.copy( parent.matrixWorld ).invert();
				object.applyMatrix4( matrix );

			}
export { planesFromMesh, createPlanes, assignTransformedPlanes, cylindricalPlanes, planeToMatrix, setObjectWorldMatrix  }
