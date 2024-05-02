import express from 'express';
import jsonwebtoken from 'jsonwebtoken'
const router = express.Router();
import Account from "../models/Account.js";
import { jwtKey } from '../config.js';


router.post('/user', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    const _pwd = req.body['pwd'];
    Account.findOne({ username: _username }).then((val) => {
        if (!val) {
            res.status(404).send("Username does not exist.");
        }
        else {
            if (val && _pwd === val.pwd) {
                const token = jsonwebtoken.sign({ username: _username, mode: val.identity }, jwtKey, { expiresIn: '10h', algorithm: 'HS256' });
                if (val.identity === 'user') {
                    res.status(201).send({
                        message: 'Login As User Successfully!\n',
                        token: 'Bearer ' + token,
                    })
                }
                if (val.identity === 'admin') {
                    res.status(200).send({
                        message: 'Login As Admin Successfully!\n',
                        token: 'Bearer ' + token,
                    })
                }
            } else {
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