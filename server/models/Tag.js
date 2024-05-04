import mongoose from 'mongoose';
// reference: https://github.com/lucashaozh/Chirpin/blob/main/chirpin/server/server.js
const TagSchema = mongoose.Schema({
    tag: { type: String, required: true, unique: true },
    tid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }] // the tweets that contain the tag
});

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;