//blocking authenticated user to again visit login and register page
function guest(req, res, next){
    if(!req.isAuthenticated()){
        return next()
    }//if logged in the redirected to home and login register page won't be available
    return res.redirect('/login')
}

module.exports = guest