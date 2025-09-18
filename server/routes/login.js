import express from 'express';
import jsonwebtoken from 'jsonwebtoken'
const router = express.Router();
import Account from "../models/Account.js";
import bcryptjs from 'bcryptjs';
import CacheService from "../utils/cacheService.js";

// the login function
router.post('/user', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    const _pwd = req.body['pwd'];
    
    try {
        // find the user from the database by username
        const val = await Account.findOne({ username: _username });
        
        // if the username does not exist in the database, send an error message
        if (!val) {
            return res.status(404).send("Username does not exist.");
        }
        
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
            await val.save();
        }
        
        if (correct) {
            // generate the Json Web Token
            const token = jsonwebtoken.sign({ username: _username, mode: val.identity }, process.env.JWT_KEY, { expiresIn: '10h', algorithm: 'HS256' });

            // 缓存用户会话信息到 Redis
            const userSessionInfo = {
                username: _username,
                identity: val.identity,
                loginTime: new Date().toISOString()
            };
            
            try {
                await CacheService.setSession(token, userSessionInfo, 36000); // 10小时
            } catch (cacheError) {
                console.warn('Failed to cache session:', cacheError);
                // 即使缓存失败，也不影响登录流程
            }

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
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({
            message: 'Internal server error'
        });
    }
});


export default router;