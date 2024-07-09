const authControl = require('../app/http/controllers/authControl');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middleware/guest');
const orderController = require('../app/http/controllers/customers/orderController');

function initRoutes(app){

    app.get('/', homeController().index );//request on / 
    
    app.get('/login', guest, authControl().login);
    app.post('/login',authControl().postLogin);

    app.get('/register', guest, authControl().register);
    app.post('/register',authControl().postRegister);//a controller can't call same function twice

    app.post('/logout', (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
       
    app.get('/cart',cartController().index);
    app.post('/update-cart',cartController().update);

    app.post('/order', orderController().store );
}
module.exports = initRoutes