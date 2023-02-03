import SpriteText from "three-spritetext";

export const spriteDialogueBox = (text) => {
  const textBox = new SpriteText(text, 5, "#ffffff");
  textBox.backgroundColor = "white";
  textBox.color = "black";
  return textBox
};
