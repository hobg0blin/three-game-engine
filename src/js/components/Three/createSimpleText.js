import {LineBasicMaterial, MeshBasicMaterial, Color,  Mesh, Object3D, ShapeGeometry, DoubleSide, Line, BufferGeometry } from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader.js'

async function createSimpleText(text, color, font) {
  const loader = new FontLoader();
  let outputText, lineText;
  const ttfLoader = new TTFLoader()
				return new Promise(resolve => {
          ttfLoader.load( font, function ( ttf ) {
          font = loader.parse(ttf)

					const matDark = new LineBasicMaterial( {
						color: color,
						side: DoubleSide
					} );

					const matLite = new MeshBasicMaterial( {
						color: color,
						transparent: true,
						opacity: 0.4,
						side: DoubleSide
					} );

					const message = text;

					const shapes = font.generateShapes( message, 100 );

					const geometry = new ShapeGeometry( shapes );

					geometry.computeBoundingBox();

					const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

					geometry.translate( xMid, 0, 0 );

					// make shape ( N.B. edge view not visible )

					outputText = new Mesh( geometry, matLite );
					outputText.position.z = 50;

					// make line shape ( N.B. edge view remains visible )

					const holeShapes = [];

					for ( let i = 0; i < shapes.length; i ++ ) {

						const shape = shapes[ i ];

						if ( shape.holes && shape.holes.length > 0 ) {

							for ( let j = 0; j < shape.holes.length; j ++ ) {

								const hole = shape.holes[ j ];
								holeShapes.push( hole );

							}

						}

					}

					shapes.push.apply( shapes, holeShapes );

					lineText = new Object3D();

					for ( let i = 0; i < shapes.length; i ++ ) {

						const shape = shapes[ i ];

						const points = shape.getPoints();
						const geometry = new BufferGeometry().setFromPoints( points );

						geometry.translate( xMid, 0, 0 );

						const lineMesh = new Line( geometry, matDark );
						lineText.add( lineMesh );

					}
          resolve({ outputText, lineText })
				} ); //end load function

        });
}

export {createSimpleText}
