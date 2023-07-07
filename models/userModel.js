// Description: User model based on mongoose schema
// Require third-party modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Constants
const defaultProfileImg = "https://fakeimg.pl/600x400?text=profile+photo";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [50, 'Name must be at most 50 characters']
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
    },
    phone: String,
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
    passwordResetTokenVerification: Boolean,
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user',
    },
    roleChangedAt: Date,
    active: {
        type: Boolean,
        default: true,
    },
    // embedded document
    address: [
        {
            postalCode: Number,
            address: String,
            city: String,
            country: String,
            flatNumber: Number,
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'products',
        }
    ]
}, {
    timestamps: true,
});


/**
 * @desc: Mongoose post middleware to add initiateBase64 to profileImg if it's not defaultProfileImg
 * @param {object} doc - document object
 * @param {string} doc.profileImg - User profile image
 */
const setInitiateBase64 = function (doc) {
    if (doc.profileImg === defaultProfileImg) return;
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.profileImg) doc.profileImg = initiateBase64 + doc.profileImg;
}

userSchema.post(/(init|save)/, setInitiateBase64);

/**
 * @desc: Mongoose pre middleware to hash password with bcrypt before saving it to database if it's modified
 * @param {function} next - next function
 * @return {*} - next function
 */
const passwordHash = function (next) {
    // if password is not modified, skip this middleware
    if(!this.isModified('password')) return next();
    // Hash password with bcrypt
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next();
}

userSchema.pre("save", passwordHash);


module.exports = mongoose.model('User', userSchema);

