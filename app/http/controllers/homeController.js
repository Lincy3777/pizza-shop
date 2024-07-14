const Menu = require('../../models/menu')
function homeController(){
//factory functions, it returns an object
    return{
        async index(req,res) {//find() renders all records of collection
            // Menu.find().then(function(pizzas){
            //     console.log(pizzas)
            //     return res.render('home',{pizzas: pizzas})
            // })
            const pizzas = await Menu.find()
            // console.log(pizzas)
            res.render('home',{pizzas: pizzas})//This function has to be async else it throws warnings
        }
    } 
}
module.exports = homeController 
