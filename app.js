import express from 'express';
const app = express();
import configRoutes from './routes/index.js'
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars'
import session from 'express-session';
import Handlebars from 'handlebars';
Handlebars.registerHelper('concat', function(str1,str2) {
  return str1+str2;
});
const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  partialsDir: ['views/partials/']
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

import fileUpload from 'express-fileupload';

app.use(fileUpload());

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app)

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });