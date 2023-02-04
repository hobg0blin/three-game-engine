import SpriteText from "three-spritetext";

export const spriteDialogueBox = (text) => {
  const textBox = new SpriteText(text, 1, "#ffffff");
  textBox.backgroundColor = "white";
  textBox.padding = 5;
  textBox.color = "black";
  return textBox;
};
