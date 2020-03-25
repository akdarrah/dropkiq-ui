import { JSDOM } from "jsdom"

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <textarea id="dropkiq-example" rows="5" cols="33"></textarea>
    <input type="text" id="dropkiq-input-example" />
    <div id="dropkiq-contenteditable-example" contenteditable="true"></div>
  </body>
</html>
`)

global['document'] = dom.window.document
global['window'] = dom.window

global['navigator'] = {
  userAgent: 'node.js'
};