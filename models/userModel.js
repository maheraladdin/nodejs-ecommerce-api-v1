const mongoose = require('mongoose');

const defaultProfileImg = "https://fakeimg.pl/600x400?text=profile+photo";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,

    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    profileImg: {
        type: String,
        default: defaultProfileImg
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

userSchema.post(/(init|save)/, function (doc) {
    if (doc.profileImg === defaultProfileImg) return;
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.profileImg) doc.profileImg = initiateBase64 + doc.profileImg;
});

module.exports = mongoose.model('User', userSchema);

