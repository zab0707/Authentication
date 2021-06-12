const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth'); 
const User = require('../models/user');

const router = express.Router();

router.get('/sign-in', authController.getSignIn);

router.post('/sign-in', [check('email').isEmail().withMessage('Please Enter Valid Email.')], authController.postSignIn);

router.get('/sign-up', authController.getSignUp);

router.post('/sign-up', 
    [
        check('email')
        .isEmail()
        .withMessage('Please Enter Valid Email.')
        .custom((value) => {
            return User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('E-Mail already exists.');
                }
            });
        }),
        check('password').isLength({min: 8}).withMessage('Password length should be atleast 8 characters.'),
        check('c_password')
        .custom((value, { req }) => {
            if(value !== req.body.password){
                throw new Error('Passwords have to match!')
            }
            return true;
        }),
    ], 
    authController.postSignUp);

module.exports = router;