import { JSDOM } from "jsdom"

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <textarea id="dropkiq-example" rows="5" cols="33"></textarea>
  </body>
</html>
`)

global['document'] = dom.window.document
global['window'] = dom.window