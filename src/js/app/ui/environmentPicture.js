export const environmentPicture = (THREE, spritePath, scene) => {
  const map = new THREE.TextureLoader().load(
    spritePath,
    function (texture) {
      console.log("SUCCESSFULLY LOADED!!!");
    },
    undefined,
    function (err) {
      console.error("An error happened.");
    }
  );
  const material = new THREE.SpriteMaterial({ map: map });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(100, 100, 1);
  sprite.position.x = -70;
  sprite.position.y = 20;
  scene.add(sprite);
};
