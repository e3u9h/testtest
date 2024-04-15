import express from 'express';
const router = express.Router();
import Account from "../models/Account.js";


router.post('/user', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    const _pwd = req.body['pwd'];
    Account.findOne({ username: _username }).then((val) => {
        if (!val) {
            res.status(404).send("Username does not exist.");
        }
        else {
            if (val.identity === 'user') {
                if (val && _pwd === val.pwd) {
                    res.status(201).send('Login As User Successfully!\n');
                }
                else {
                    console.log("incorrect");
                    res.status(401).send("Incorrect Username or Password.\n");
                }
            }
            if (val.identity === 'admin') {
                if (val && _pwd === val.pwd) {
                    res.status(200).send('Login As Admin Successfully!\n');
                }
                else {
                    res.status(401).send("Incorrect Username or Password.\n");
                }
            }
        }
    }).catch((err) => {
        res.send(err);
    });
});


export default router;