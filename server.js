const fs = require('fs');
const util = require('util');
const del = require('del');
const express = require('express');
const request = require('request');
const multer  = require('multer');
const csvParser = require('csv-parse');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./config');
const upload = multer({ dest: 'temp/' });
const webpackDevConfig = require('./webpack.dev.config.js');

const app = express();
const compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackDevConfig.output.publicPath,
  stats: { colors: true }
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}));

app.use(express.static(__dirname + '/assets'));

del.sync(['temp/*']);
del.sync(['assets/exports/*']);

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(compiler.outputPath + 'index.html', (err, result) => {
    if (err)
      return next(err);
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  });
});

app.post('/upload', upload.fields([{ name: 'fileinput' }, { name: 'inputcategory' }]), (req, res, next) => {
  let exportsPath = __dirname + '/assets/exports';
  let exportPath = __dirname + '/assets/exports/export.csv';

  if (!fs.existsSync(exportsPath))
    fs.mkdirSync(exportsPath);

  if (fs.existsSync(exportPath))
    fs.unlinkSync(exportPath);

  let source = fs.createReadStream(req.files['fileinput'][0].path);

  let output = [];
  let parser = csvParser({ delimiter: ';' });
  let counter = 0;
  let category = req.body.inputcategory;
  let results = [];

  parser.on('readable', () => {
    while(record = parser.read()) {
      output.push(record);
    }
  });

  parser.on('error', (err) => {
    console.log(err.message);
  });

  parser.on('finish', () => {
    fs.appendFileSync(__dirname + '/assets/exports/export.csv', 'Active (0/1);Name *;Categories (x,y,z...);Price tax excluded or Price tax included;EAN13;Quantity;URL rewritten;Image URLs (x,y,z...)\r\n');
    output.slice(1).forEach((item, index, arr) => {
      request(config.LASTFM_API_URL + config.getAPIResource('album.getinfo', `&artist=${encodeURIComponent(item[0].trim())}&album=${encodeURIComponent(item[3].trim())}`), (err, response, body) => {
        if (err)
          throw new Error(err);
        let result = JSON.parse(body);
        if (result.album) {
          let row = '';
          let name = (`${result.album.artist} ${result.album.name}`).toLowerCase().replace(/\s/g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
          row += `0;"${result.album.artist} - ${result.album.name}";"${category}";"${item[8]}";"${item[2]}";"${item[5]}";"${name}";"${result.album.image.filter((image) => image.size === 'mega')[0]['#text']}"\r\n`;
          fs.appendFileSync(__dirname + '/assets/exports/export.csv', row);
          // console.log(`Exported row#${counter}`);
          results.push({title: `${item[0]} - ${item[3]}`, state: 'ok'});
        } else {
          results.push({title: `${item[0]} - ${item[3]}`, state: 'error'});
        }
        if (++counter == arr.length) {
          // console.log('Export complete');
          res.json({
            results: JSON.stringify(results),
            exportPath: '/exports/export.csv'
          });
        }
      });
    });
    parser.end();
  });

  source.pipe(parser);
});

app.post('/test', (req, res) => {
  setTimeout(() => {
    res.sendStatus(200);
  }, 2000);
});

app.listen(config.APP_PORT, () => console.log(`listening on ${config.APP_PORT}`));

module.exports = { app };