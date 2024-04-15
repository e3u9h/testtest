import express from 'express';
const router = express.Router();
import Account from "../models/Account.js";

router.put('/changepwd', (req, res) => {
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
            if (oldpwd !== acc.pwd) {
                res.send("The old password is incorrect!").status(404);
            }
            else {
                acc.pwd = newpwd;
                acc.save();
                res.send("Update Successfully!").status(200);
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