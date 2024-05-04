import mongoose from 'mongoose';

const NotificationSchema = mongoose.Schema({
    username: { type: String, required: true }, //who is receiving this notifications
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who is sending this notification
    action: { type: String, required: true }, // follow, like, comment, retweet
    tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }, // which tweet is involved, null for follow action
    time: { type: Date, required: true }
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;


