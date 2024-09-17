const authControl = require('../app/http/controllers/authControl');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const Menu = require('../app/models/menu');


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
    
// Route to render the edit page
app.get('/admin/menu/edit/:id', async (req, res) => {
    const { id } = req.params; // Get the pizza ID from the URL
    
    try {
        // Find the pizza by ID
        const pizza = await Menu.findById(id);
        const user = req.user;
        // Render the edit page and pass the pizza details to it
        res.render('edit', { pizza });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin Panel - Update Pizza
app.post('/admin/menu/update/:id', async (req, res) => {
    const { id } = req.params; // Get the pizza ID from the URL
    const { name, price, size, type } = req.body; // Get the updated details from the form

    try {
        // Find the pizza by ID and update its details
        await Menu.findByIdAndUpdate(id, { name, price, size, type });

        // Redirect back to the admin menu page after the update
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

}
module.exports = initRoutes
