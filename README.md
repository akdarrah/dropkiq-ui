![Dropkiq_logo-dk](https://user-images.githubusercontent.com/69064/68704782-dd868e80-055a-11ea-952c-78bd9e9344d6.png)

# DropkiqUI

**[Dropkiq](https://www.dropkiq.com/) simplifies the creation of Liquid expressions.** Quickly build your dynamic content with the simplest Liquid template editor.

* *Immediate Feedback:* No more guesswork. Know exactly how your expressions will evaluate in real time.
* *No More Typos:* To err is human. Identify mistakes as they happen and take corrective measures.
* *Visibility of Options:* Data at your fingertips. See what data is available without asking your development team.

Check it out at [https://www.dropkiq.com](https://www.dropkiq.com/)!

DropkiqUI works with the Dropkiq Engine in order to provide inline Liquid suggestions as users write Liquid documents.

The Dropkiq Engine can be found here: https://www.npmjs.com/package/dropkiq. The engine is responsible for processing the text, caret position, and schema of the application to make suggestions as the user types. The DropkiqUI (contained in this repository) is responsible for rendering the UI so that users may see those suggestions.

The DropkiqUI has been tested in all major browsers and works with standard text input, textarea, and contenteditable fields.

## Installation

DropkiqUI is available via npm: https://www.npmjs.com/package/dropkiq-ui

With NPM:

```
npm install dropkiq-ui
```

With Yarn:

```
yarn install dropkiq-ui
```


Example Installation instructions for Rails (Assuming you're using Webpacker: https://github.com/rails/webpacker):

1. In package.json, you should add dropkiq-ui

```
{
  name: "My Application",
  "dependencies": {
    "dropkiq-ui": "^1.0.4"
  }
}
```

2. In `javascript/packs/application.ts`, import the DropkiqUI library:

```
var { DropkiqUI } = require('dropkiq-ui');
window['DropkiqUI'] = DropkiqUI;
```

3. In `app/assets/stylesheets/application.scss`, import the DropkiqUI CSS:

```
@import 'dropkiq-ui/dist/dropkiq';
```

4. Then, use the DropkiqUI within your application:

```
var schema = gon.dropkiq_schema_yaml;
var scope = gon.example_data;
var context = {
  activity: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: 'activities'
  },
  first_name: {
    type: "ColumnTypes::String",
    foreign_table_name: null
  },
  last_name: {
    type: "ColumnTypes::String",
    foreign_table_name: null
  }
};

new window.DropkiqUI(document.getElementById('basic-dropkiq-example-1'), schema, context, scope, gon.licenseKey);
```

## Development

After checking out the repo, run `yarn` to install dependencies. Then, run `yarn jest` to run the tests.

To generate a new build, run `gulp`.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/akdarrah/dropkiq-ui. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The Dropkiq UI Javascript Library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
