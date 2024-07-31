const authControl = require('../app/http/controllers/authControl');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

//Middlewares
const guest = require('../app/http/middleware/guest');
const admin = require('../app/http/middleware/admin')
const auth = require('../app/http/middleware/auth');

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

    //customer routes
    app.post('/order',auth, orderController().store );
    app.get('/customers/orders',auth ,orderController().index)
    app.get('/customers/orders/:id',auth ,orderController().show)
    //since id is a dynamic parameter : is used 

    //Admin routes
    app.get('/admin/orders', admin , AdminOrderController().index)
    app.post('/admin/order/status', admin , statusController().update)

}
module.exports = initRoutes
