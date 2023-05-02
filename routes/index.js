import gameRoutes from './games.js'
import CommentsRouter from './comment.js';
import auth_routes from './auth_routes.js'
//import userRouter from './user.js';
import userRouter from './user.js';
import gameCompareRouter from './gameCompare.js'

const constructor=(app)=>{
    app.use('/games',gameRoutes);
    app.use('/comment', CommentsRouter);
    app.use('/', auth_routes)
    //app.use('/user', userRouter);
    app.use('/compare',gameCompareRouter)
    app.use('/user', userRouter);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
      });

}

export default constructor;