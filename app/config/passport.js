const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async(email, password, done) => {
        //login
        //whether the email exists
        const user = await User.findOne({email: email})//this user is fetch via db
        if(!user){
            return done(null, false, { message:'NO user with this email'})
        }
        //if we find the email will cross check the password corresponding the email
        bcrypt.compare(password, user.password).then(match => {//user's password from the db is compared with the password entered
            if(match){
                return done(null, user, { message: 'Logged in succesfully'})
            }
            //if the password doesn't match with the password in the db
            return done(null, false, {message: 'Wrong username or password'})
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'});
        });
    }))
    passport.serializeUser((user,done) => {//When the user login in the session stores values which are passed in the parameter 
        done(null, user._id)
    });
    // passport.deserializeUser((id,done)=>{//the session which was stored above from there here we fetch data
    //     User.findById(id, (err, user) => {
    //         done(err, user);
    //     });
    // });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
    
    // req.user//logged in users
}

module.exports = init
