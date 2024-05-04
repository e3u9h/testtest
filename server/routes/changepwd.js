import express from 'express';
const router = express.Router();
import Account from "../models/Account.js";
import bcryptjs from 'bcryptjs';

router.put('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.body.username;
    const newpwd = req.body.newpwd;
    const oldpwd = req.body.oldpwd;
    console.log("newpwd:" + newpwd);
    Account.findOne({ username: username }).then((acc) => {
        if (!acc) {
            console.log(username);
            res.sendStatus(404);
        }
        else if (newpwd !== '') {
            let correct = false;
            if (acc && bcryptjs.compareSync(oldpwd, acc.pwd)) {
                correct = true;
            } else if (acc && oldpwd === acc.pwd) {
                // this part is for the transition from the not-encrypted version to the encrypted version
                // because in our previous version, the passwords are saved in plain text
                // after all the users' passwords are encrypted, this part can be deleted
                correct = true;
            }
            if (correct === false) {
                res.status(404).send("The old password is incorrect!");
            }
            else {
                acc.pwd = bcryptjs.hashSync(newpwd, 10);
                acc.save();
                res.status(200).send("Updated Successfully!");
            }

        }
        else {
            return res.send('Failed to change password.').status(404);
        }
    }).catch((err) => {
        res.send(err);
    });
});

export default router;