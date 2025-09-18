import mongoose from 'mongoose';

const TweetSchema = mongoose.Schema({
    poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tweet_content: { type: String },
    files: [{ type: String }],
    tags: [{ type: String, required: true }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        portrait: { type: String },
        content: { type: String },
        floor: { type: Number },
        time: { type: Date }
    }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    likes: [{
        time: { type: Date, required: true },
        username: { type: String, required: true },
    }],
    dislike_counter: { type: Number, required: true },
    report_counter: { type: Number, required: true },
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    post_time: { type: Date, required: true },
    private: { type: Boolean, required: true },
});

const Tweet = mongoose.model('Tweet', TweetSchema);

export default Tweet;