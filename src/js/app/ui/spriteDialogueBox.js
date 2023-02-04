import SpriteText from "three-spritetext";

export const spriteDialogueBox = (text) => {
  const textBox = new SpriteText(text, 3, "#ffffff");
  textBox.backgroundColor = "white";
  textBox.padding = 5;
  textBox.color = "black";
  return textBox;
};
