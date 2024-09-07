import axios from 'axios';
import Noty from 'noty';

export function placeOrder(formObject){
    axios.post('/order', formObject).then((res) =>{
        new Noty({
            type:'success',
            timeout: 1000,
            text: res.data.message,
            progressBar : false,
          }).show() ;

          //inbulid function to add a delay inorder the display the noty for 1sec
          setTimeout(() =>{
            window.location.href = '/customers/orders';
          },1000);
      }).catch((err) => {
        new Noty({
            type:'error',
            timeout: 1000,
            text: err.res.data.message,
            progressBar : false,
          }).show() ;
    });
}