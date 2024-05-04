import express from 'express';
import jsonwebtoken from 'jsonwebtoken'
const router = express.Router();
import Account from "../models/Account.js";
import { jwtKey } from '../config.js';
import bcryptjs from 'bcryptjs';

// the login function
router.post('/user', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    const _pwd = req.body['pwd'];
    // find the user from the database by username
    Account.findOne({ username: _username }).then((val) => {
        // if the username does not exist in the database, send an error message
        if (!val) {
            res.status(404).send("Username does not exist.");
        }
        else {
            // verify the password
            let correct = false;
            // bcrypyjs.compareSync is for comparing the input password (in plain text) with the encrypted correct password
            if (val && bcryptjs.compareSync(_pwd, val.pwd)) {
                correct = true;
            } else if (val && _pwd === val.pwd) {
                // this part is for the transition from the not-encrypted version to the encrypted version
                // because in our previous version, the passwords are saved in plain text
                // if the plain text password is correct, update the password to the encrypted version
                // after all the users' passwords are encrypted, this part can be deleted
                correct = true;
                val.pwd = bcryptjs.hashSync(_pwd, 10);
                val.save();
            }
            if (correct) {
                // generate the Json Web Token
                const token = jsonwebtoken.sign({ username: _username, mode: val.identity }, jwtKey, { expiresIn: '10h', algorithm: 'HS256' });
                // use the identity in the Account schema to determine the user's mode,
                // and use response status to differentiate them when sending to the client
                if (val.identity === 'user') {
                    // 201 for user
                    res.status(201).send({
                        message: 'Login As User Successfully!\n',
                        token: 'Bearer ' + token,
                    })
                }
                if (val.identity === 'admin') {
                    // 200 for admin
                    res.status(200).send({
                        message: 'Login As Admin Successfully!\n',
                        token: 'Bearer ' + token,
                    })
                }
            } else {
                // if the password is incorrect, send an error message
                console.log("incorrect");
                res.status(403).send({
                    message: 'Incorrect Password!\n'
                })
            }
        }
    }).catch((err) => {
        res.send(err);
    });
});


export default router;