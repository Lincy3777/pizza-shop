const Order = require('../../../models/order');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
    return {
        async store(req, res) {
            const { phone, address, stripeToken, paymentType } = req.body;

            // Validate request
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fields are mandatory' });
            }

            // Check if cart exists and has items
            if (!req.session.cart || !req.session.cart.items) {
                return res.status(400).json({ message: 'Your cart is empty' });
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            });

            try {
                const result = await order.save();
                const placedOrder = await Order.populate(result, { path: 'customerId' });

                // Stripe payment
                if (paymentType === 'card') {
                    try {
                        await stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100, // Assuming totalPrice is stored in session
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`,
                        });

                        placedOrder.paymentType = paymentType;
                        placedOrder.paymentStatus = true;
                        await placedOrder.save();

                        // Emit event
                        const eventEmitter = req.app.get('eventEmitter');
                        eventEmitter.emit('orderPlaced', placedOrder);

                        // Clear cart and send response
                        delete req.session.cart;
                        return res.json({ message: 'Payment successful, Order placed successfully' });
                    } catch (err) {
                        console.error('Payment error:', err);
                        delete req.session.cart;
                        return res.json({
                            message: 'Order placed but Payment failed, Payment can be made upon delivery.',
                        });
                    }
                } else {
                    // Non-card payment flow
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', placedOrder);
                    delete req.session.cart;
                    return res.json({ message: 'Order placed successfully' });
                }
            } catch (err) {
                console.error('Error placing order:', err);
                return res.status(500).json({ message: 'Something went wrong' });
            }
        },

        async index(req, res) {
            try {
                const orders = await Order.find({ customerId: req.user._id }, null, {
                    sort: { createdAt: -1 },
                });
                res.render('customers/orders', { orders: orders, moment: moment });
            } catch (err) {
                console.error('Error fetching orders:', err);
                res.status(500).json({ message: 'Failed to retrieve orders' });
            }
        },

        async show(req, res) {
            try {
                const order = await Order.findById(req.params.id);
                // Authorize user
                if (req.user._id.toString() === order.customerId.toString()) {
                    // Render invoice page and pass the order details
                    res.render('customers/invoice', { order });
                } else {
                    res.redirect('/');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                res.status(500).json({ message: 'Failed to retrieve order' });
            }
        }
                        
    };
}

module.exports = orderController;
