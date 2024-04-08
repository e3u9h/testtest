import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
    gender: { type: String },
    interests: [{ type: String }],
    about: { type: String },
    follower_counter: { type: Number },
    following_counter: { type: Number },
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tweets_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    users_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    users_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    report_counter: { type: Number },
    tweets_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    tweets_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    portrait: { type: String }
});

const User = mongoose.model('User', UserSchema);

export default User;