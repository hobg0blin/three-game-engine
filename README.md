## A VERY BASIC PROTOTYPE OF A THREE.JS GAME ENGINE

### Running

To run this on your own machine, just clone it and run ```npm install`, then `npm run dev`. A simple scene should be available at `localhost:8080/main`.

### Structure

`app.js` creates simple React app and embeds the Three.js scene set up in `main.js`.

The core game stuff runs from the `app` folder. 

`main.js` runs the damn thing.

`engine/setup.js` gets the basic THREE environment running in the browser, creating a `world` object that allows you to access the scene, camera, lights, etc. It also contains a currently unopinionated `sceneHandler` function where you can set up logic for switching between scenes/levels.

`engine/scene.js` provides core functions for building a  “scene” or level - I need a better wording for this, maybe level. The core idea is that this `scene.js` allows you to swap out objects, text and postprocessing effects, while the basic THREE environment built in `setup.js` remains the same.

`scenes/` is where your individual scenes, or levels (I really need a better naming structure here) can live. Each should follow the structure of the core `scene` object in `engine/scene.js`, but you can customize each `addObjects` and `customAnimation` function.

`components` contains a whole bunch of different experiments I’ve done previously in Three that are not well-documented at all, but may come in handy in the process of building a game -- just import them into your scenes and find out!


