import fs from 'fs'
import puppeteer from 'puppeteer'

function getEmptyDirs(path) {
  return fs.readdirSync(path).filter(function(file) {
      let stat = fs.statSync(path + '/' + file)
      if (stat.isDirectory() && file.indexOf('sketch') >= 0 && checkForImg('../src/public/screenshots', file)) {
        return true;
      }
  })
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

let dirs = getEmptyDirs('../src/js/')
let fullDirs = getDirs('../src/js/')
let options = {
  timeout: 0,
  launchOptions: {
    headless: true  }
}



dirs.map(async dir => {
const browser = await puppeteer.launch({
        "headless": true,
        "timeout": 0
  });

  const page = await browser.newPage();
  await page.goto('https://blog.hellagrapes.club/three/dist/' + dir + '/index.html'); //
  return page.screenshot({ path: '../src/public/screenshots/' + dir + '.jpg' });
  await browser.close()

})

let reversed = fullDirs.reverse()
let data = ""
for (let dir of reversed) {
  let text = dir.replace("sketch", "").replace("_", " ")
  data+=`<div><a href="https://blog.hellagrapes.club/three/dist/${dir}/"><img src="https://blog.hellagrapes.club/three/screenshots/${dir}.jpg"/>${text}</a></div>`
}
fs.writeFile("../src/public/index.html", data, e => {
  console.log('error:', e)
})
console.log('end')
