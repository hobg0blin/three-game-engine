## A VERY BASIC PROTOTYPE OF A THREE.JS GAME ENGINE

### Running

To run this on your own machine, just clone it and run `npm install`, then `npm run dev`. A simple scene should be available at `localhost:8080/main`.

### Structure

`app.js` creates simple React app and embeds the Three.js scene set up in `main.js`.

The core game stuff lives in the `app` folder. 

`main.js` runs the damn thing.

#### ENGINE

`engine` is where the core game logic should live: things like game state, player state, and switching between levels, etc.

`engine/setup.js` gets the basic THREE environment running in the browser, creating a `world` object that allows you to access the scene, camera, lights, etc. It also contains a currently unopinionated `sceneHandler` function where you can set up logic for switching between scenes/levels.

For now, if you want to test out the two example levels, just switch between importing `level1` and `level2` in `setup.js` and import the relevant one in `sceneHandler` .
This also gives you access to the `world` object, where all the core THREE stuff (scene, camera, etc.) is attached and can be changed.

`engine/level.js` provides core functions for building a level  The core idea is that this `level.js` allows you to swap out objects, text and postprocessing effects, while the basic THREE environment built in `setup.js` remains the same.

#### UI

`ui` is where, well, UI components live. This should be things like buttons, dialogue boxes, and so on. Right now the most useful one is `dialogueBox.js`, which allows you to create a dialogue box with text, and buttons with their own text and callbacks (which will eventually be able to affect state).

#### LEVELS

`levels/` is where your individual levels can live. Each should follow the structure of the core `level` object in `engine/level.js`, but you can customize each `addObjects` and `customAnimation` function.

Inside a level, you should basically be:

1) Adding any level-specific objects, animations, or internal state.

2) Adding dialogue boxes that follow a dialogue tree - this should be something like a JSON file that contains the text of dialogue options, where they lead, and anything that affects player or game state.

`components` contains a whole bunch of different experiments I’ve done previously in Three that are not well-documented at all, but may come in handy in the process of building a game -- just import them into your scenes and find out!

The `public` folder similarly holds a bunch of old textures, models, and files that you may or may not find useful.
