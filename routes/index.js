import gameRoutes from './games.js'
import CommentsRouter from './comment.js';
import auth_routes from './auth_routes.js'
//import userRouter from './user.js';

const constructor=(app)=>{
    app.use('/games',gameRoutes);
    app.use('/', CommentsRouter);
    app.use('/', auth_routes)
    //app.use('/user', userRouter);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
      });

}

export default constructor;