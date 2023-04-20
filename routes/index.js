import CommentsRouter from './comment.js';

const constructorMethod = (app) => {
    app.use('/', CommentsRouter);
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
  };
  
  export default constructorMethod;