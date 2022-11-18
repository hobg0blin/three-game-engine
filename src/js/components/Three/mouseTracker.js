
let mouse = {x: 0, y: 0}

function onDocumentMouseMove( event ) {

  mouse.x = ( event.clientX - window.innerWidth / 2 );
  mouse.y = ( event.clientY - window.innerHeight / 2 );

}

document.addEventListener( 'mousemove', onDocumentMouseMove );

export { mouse }
