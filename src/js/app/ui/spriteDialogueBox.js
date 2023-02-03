import SpriteText from "three-spritetext";

export const spriteDialogueBox = (text, scene) => {
  const textBox = new SpriteText(text, 10, "#ffffff");
  textBox.backgroundColor = "white";
  textBox.color = "black";
  scene.add(textBox);
};
