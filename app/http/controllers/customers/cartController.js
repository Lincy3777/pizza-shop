function cartController() {
    return {
        index(req, res) {
            if (!req.session.cart || Object.keys(req.session.cart.items).length === 0) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                };
            }
            res.render('customers/cart');
        },
        
        update(req, res) {
            if (!req.session.cart) {//creating the cart for the first time and adding basic object structure
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                };
            }

            let cart = req.session.cart; // Get the cart from the session
            const { _id } = req.body; // Extract item ID from the request body
            const price = req.body.price || (cart.items[_id] && cart.items[_id].item.price);

            if (req.body.action) {
                const action = req.body.action;

                if (action === 'increment' && cart.items[_id]) {
                    cart.items[_id].qty += 1;
                    cart.totalQty += 1;
                    cart.totalPrice += price;
                } else if (action === 'decrement' && cart.items[_id]) {
                    cart.items[_id].qty -= 1;
                    cart.totalQty -= 1;
                    cart.totalPrice -= price;

                    if (cart.items[_id].qty <= 0) {
                        cart.totalPrice -= cart.items[_id].qty * price; // Adjust totalPrice if qty is negative
                        delete cart.items[_id];
                    }
                } else if (action === 'remove' && cart.items[_id]) {
                    const itemQty = cart.items[_id].qty;
                    const itemTotalPrice = itemQty * price;

                    cart.totalQty -= itemQty;
                    cart.totalPrice -= itemTotalPrice;

                    delete cart.items[_id];
                }
            } else {//second cart 
                if (!cart.items[_id]) {
                    cart.items[_id] = {
                        item: req.body,
                        qty: 1,
                    };
                    cart.totalQty += 1;
                    cart.totalPrice += price;
                } else {
                    cart.items[_id].qty += 1;
                    cart.totalQty += 1;
                    cart.totalPrice += price;
                }
            }

            if (cart.totalPrice < 0) {
                cart.totalPrice = 0;
            }

            return res.json({ totalQty: cart.totalQty, totalPrice: cart.totalPrice });
        }
    };
}

module.exports = cartController;
