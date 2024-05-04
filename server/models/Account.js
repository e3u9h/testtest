import mongoose from 'mongoose';
// reference: https://github.com/lucashaozh/Chirpin/blob/main/chirpin/server/server.js

// The Account schema is used for storing the username, password and identity for both users and admins
const AccountSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
    pwd: { type: String, required: true },
    identity: { type: String, required: true }
});

const Account = mongoose.model('Account', AccountSchema);

export default Account;
