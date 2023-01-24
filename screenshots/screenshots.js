import fs from 'fs'
import puppeteer from 'puppeteer'

function getEmptyDirs(path) {
  return fs.readdirSync(path).filter(function(file) {
      let stat = fs.statSync(path + '/' + file)
      if (stat.isDirectory() && file.indexOf('sketch') >= 0 && checkForImg('../src/public/screenshots', file)) { return true;
      } })
}
function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}


function getDirs(path) {
  return fs.readdirSync(path).filter(function(file) {
      let stat = fs.statSync(path + '/' + file)
      if (stat.isDirectory() && file.indexOf('sketch') >= 0 ) {
        return true;
      }
  })
}
//see if img already written
function checkForImg(path, file) {
  const dirCont = fs.readdirSync(path + '/');
  const files = dirCont.filter((dir) => {
    return dir.indexOf(file) >= 0;
  })
  if (files.length >= 1) {
    return false
  } else {
    console.log('unwritten file: ', file)
    return true
  }
}

let dirs = getEmptyDirs('../src/js/fall_2022')
let fullDirs = getDirs('../src/js/fall_2022')
let options = {
  timeout: 0,
  launchOptions: {
    headless: true  }
}



let browsers = dirs.slice(0,10).map(async dir => {
const browser = await puppeteer.launch({
        "headless": true,
        "timeout": 0
  });

  console.log('going to : ', dir);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://blog.hellagrapes.club/three/dist/' + dir + '/index.html'); //
  await delay(1000);
  const [button] = await page.$x("//button[contains(., 'Generate')]");
  if (button) {
    console.log('found button: ', button);
      await button.click();
      await delay(500);
  }
  console.log('loaded: ', dir);
  let screenshot = await page.screenshot({ path: '../src/public/screenshots/' + dir + '.jpg' });
  console.log('screenshot made for ', dir);
  await browser.close()
  console.log('browser closed!')
  return screenshot
})


let reversed = fullDirs.reverse()
console.log('reverse: ', reversed)
let data = "<html><head><title>Brent's Cool Sketches</title><link rel='stylesheet' href='/three/css/screenshots.css'></head><body><h1>My Cool Code Sketches</h1><p>These are code sketches I do on a semi-regular basis. This page and the sketch screenshots are (mostly) generated automatically, so if you see a black screen or broken image it's probably because I did something particularly weird that day.</p> "
  data += `<h2>Fall/Winter 2022</h2><div class='container'>`
for (let dir of reversed) {
  let text = dir.replace("sketch", "").replace(/_/g, " ")
  data+=`<div class='sketch'><a href="https://blog.hellagrapes.club/three/fall_2022/${dir}/"><img src="https://blog.hellagrapes.club/three/screenshots/${dir}.jpg"/>${text}</a></div>`
}
data += '</div></body></html>'
fs.writeFile("../src/public/index.html", data, e => {
  console.log('error:', e)
})
console.log('end')
