const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getSignIn = (req, res, next) => {
    res.render('auth/signin', {
        pageTitle: 'Sign-In',
        errors: [],
        oldInput: {
            email: '',
            password: ''
        },
    });
};

exports.postSignIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signin',{
            pageTitle: 'Sign-Ip',
            errors: errors.errors,
            oldInput: {
                email: email,
                password: password
            },
        });
    }
    User.findOne({email: email})
    .then(user => {
        if(!user){
            return res.status(422).render('auth/signin',{
                pageTitle: 'Sign-Ip',
                errors: [{msg: 'Invalid email or password.'}],
                oldInput: {
                    email: email,
                    password: password
                },
            });
        }
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                res.redirect('/');
            }
            return res.status(422).render('auth/signin',{
                pageTitle: 'Sign-Ip',
                errors: [{msg: 'Invalid email or password.'}],
                oldInput: {
                    email: email,
                    password: password
                },
            });

        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign-Up',
        errors: [],
        oldInput: {
            email: '',
            password: '',
            c_password: ''
        },
    });
};

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const c_password = req.body.c_password;

    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
            pageTitle: 'Sign-Up',
            errors: errors.errors,
            oldInput: {
                email: email,
                password: password,
                c_password: c_password
            },
        });
    }
    bcrypt.hash(password, 12)
    .then(hashPassword => {
        const user = new User({
            email: email,
            password: hashPassword
        });
        return user.save();
    })
    .then(result => {
        res.redirect('/auth/sign-in');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
