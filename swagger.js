
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:8080',

  auth: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

const outputFile = './swagger.json';
// const routes = ['./routes/auth.js', './routes/product.js', './routes/user.js' ];

const routes = ['./web.js']
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);