# Basic-Web-Template

## Require:
- Docker and docker-compose [https://docs.docker.com/get-docker/]()
- Node and npm [https://nodejs.org/en/download/]() 
- Gulp [https://gulpjs.com/docs/en/getting-started/quick-start]()

## Quick Start
First use: run `npm i`

To start: run `npm start` and open [http://localhost:8080/]()

To build: run `npm run build`

To stop: run `npm run stop`


## Features
### Handlebars HTML
The HTML build use handlebar [https://handlebarsjs.com/](), you can put your data in `data.json`,
add some helpers functions in `handlebarHelpers.js`, and your partials in the folder `src/partials`.

### SASS
This template use dart-sass [https://sass-lang.com/dart-sass]() to build css,
you can use all features and syntax (ex: `@use foo`). Use relative path `my/path/toStyle`.

### Javascript
The template build an minified javascript with Babel and rollup. You can use all the recent syntax, and import files.
Use relative path like: `import data from "./my/path/data.js";`. You can import json too.

### Assets responsive
You can resize the pictures (jpg, jpeg, png) in folder `src/assets/images`, just update the file `imagesResizeConfig.json`.
Here: [https://www.npmjs.com/package/gulp-responsive]() you can have access to the documentation of the config.


## QA

### How to change port ?
In docker-compose.yml change l. 8 the default port (8080)

### Why there is an index.es.min.js and an index.iife.min.js ? 
Because all the browser cannot execute the same level of JS technologies (ex: ES2015). 
This template create two types of script: one lighter for the most recent browser, 
and a heavier one for older browsers. When you develop your app only the index.es.min.js is updated. 
Before sending your site to production, think about doing a build (`npm run build`).
