import express from 'express';
import jsonwebtoken from 'jsonwebtoken'
const router = express.Router();
import Account from "../models/Account.js";
import { jwtKey } from '../config.js';

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
            if (val && _pwd === val.pwd) {
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