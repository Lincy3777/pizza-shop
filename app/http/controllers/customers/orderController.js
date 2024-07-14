const Order = require('../../../models/order')
const moment = require('moment');

function orderController() {
    return{
        store(req, res){
            // console.log(req.body);//this data has to be stored in db 
            // console.log(req.user._id)
            //validate request
            const { phone, address} = req.body;
            if(!phone || !address){
                req.flash('error','All fields are mandatory');
                return res.redirect('/cart')
            };
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });
            order.save()
            .then(result => {
                console.log('Order saved successfully');
                req.flash('success', 'Order placed successfully');
                delete req.session.cart;
                return res.redirect('/customers/orders');
            })
            .catch(err => {
                console.error('Error saving order:', err);
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            });
        },
        async index(req, res){
            const orders = await Order.find({customerId: req.user._id}, null, {sort:{'createdAt': -1}})//-1 = descending order
            res.render('customers/orders', {orders: orders, moment: moment })
            // console.log(orders)
        }
    }
};
module.exports = orderController;