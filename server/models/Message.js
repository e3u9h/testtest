import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;