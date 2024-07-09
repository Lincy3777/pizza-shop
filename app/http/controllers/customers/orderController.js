const Order = require('../../../models/order')
function orderController(){
    return{
        store(req, res){
            // console.log(req.body);//this data has to be stored in db 
            //validate request
            const { phone, address} = req.body
            if(!phone || !address){
                req.flash('error','All fields are mandatory');
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });
            order.save().then(result => {
                console.log(req.body);
                req.flash('success','Order placed sucessfully');
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            });
        }
    }
}

module.exports = orderController

