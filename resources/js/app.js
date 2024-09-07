import axios from 'axios';
import Noty from 'noty'; 
import { initAdmin } from './admin';
import moment from 'moment';
import { initStripe } from './stripe' ;

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza){
    //Ajax call
    axios.post('/update-cart',pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type:'success',
            timeout: 500,
            text: 'Item added to cart',
            progressBar : false,
          }).show() ;
        }).catch(err => {
        new Noty({
            type:'error',
            timeout:700,
            text: 'something went wrong',
            progressBar : false,
          }).show();  
    });
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        console.log(pizza)
    })
})

//Remove alert message
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}

//change order status
let statuses = document.querySelectorAll('.status_line') ;
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');
// console.log(order);
function updateStatus(order){
    statuses.forEach((s) =>{
        s.classList.remove('step-completed')
        s.classList.remove('current')

    })
    let stepCompleted = true;
    statuses.forEach((status) =>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        } 
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){//we are checking if there is a next element or not, otherwise at the last point it might throw error
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}
updateStatus(order);

initStripe();

//socket
let socket = io();

//join
if(order){
    socket.emit('join', `order_${order._id}`);
}
let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')){
    initAdmin(socket);  
    socket.emit('join', 'adminRoom');
}


socket.on('orderUpdated',(data) => {
    const updatedOrder ={ ...order };//we are copying the order
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    console.log(data)
    new Noty({
        type:'success',
        timeout: 1000,
        text: 'Order Updated',
        progressBar : false,
      }).show() ;
});