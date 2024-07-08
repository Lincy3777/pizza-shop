const authControl = require('../app/http/controllers/authControl');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController')

function initRoutes(app){

     app.get('/', homeController().index );//request on / 
    // (req, res) => {
    //     res.render('home');
    // }
    
    app.get('/login',authControl().login);
    
    app.get('/register',authControl().register);

    app.get('/cart',cartController().index);
    app.post('/update-cart',cartController().update)

}
module.exports = initRoutes