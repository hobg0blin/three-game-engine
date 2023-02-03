import { Text } from "troika-three-text";

export const troikaDialogueBox = (text, scene) => {
  // Create:
  const myText = new Text();
  scene.add(myText);

  // Set properties to configure:
  myText.text = text;
  myText.fontSize = 5;
  //myText.position.z = 0;
  myText.position.y = 65;
  myText.position.x = -10;
  myText.color = 0xffffff;
  myText.maxWidth = 100;

  // Update the rendering:
  myText.sync();
};
