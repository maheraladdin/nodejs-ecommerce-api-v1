// Purpose: User model for the database

// Require mongoose
const mongoose = require('mongoose');

// Require bcrypt
const bcrypt = require('bcrypt');

// Constants
const defaultProfileImg = "https://fakeimg.pl/600x400?text=profile+photo";

/**
 * @desc    create user schema using mongoose schema
 * @param   {object} userSchema - user schema object
 * @param   {string} userSchema.name - username
 * @param   {string} userSchema.slug - user slug
 * @param   {string} userSchema.email - user email
 * @param   {string} userSchema.phone - user phone
 * @param   {string} userSchema.profileImg - user profile image
 * @param   {string} userSchema.password - user password
 * @param   {date} userSchema.passwordChangedAt - user password changed at
 * @param   {string} userSchema.passwordResetToken - user password reset token
 * @param   {date} userSchema.passwordResetTokenExpire - user password reset token expire
 * @param   {boolean} userSchema.passwordResetTokenVerification - user password reset token verification
 * @param   {String} userSchema.role - user role
 * @param   {object} userSchema.roleChangedAt - user role changed at
 * @param   {object} userSchema.active - user active
 * @param   {object} userSchema.addresses - user addresses
 * @param   {object} userSchema.addresses.alias - user addresses alias
 * @param   {object} userSchema.addresses.details - user addresses details
 * @param   {object} userSchema.addresses.phone - user addresses phone
 * @param   {object} userSchema.addresses.city - user addresses city
 * @param   {object} userSchema.addresses.postalCode - user addresses postal code
 * @param   {object} userSchema.wishlist - user wishlist
 * @param   {object} userSchema.timestamps - user timestamps
 */
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
    addresses: [
        {
            id: mongoose.Schema.Types.ObjectId,
            alias: {
                type: String,
                required: [true, 'An address must have an alias'],
                trim: true,
                unique: [true, 'Alias must be unique'],
                minLength: [3, 'Alias must be at least 3 characters'],
                maxLength: [20, 'Alias must be at most 20 characters']
            },
            details: String,
            phone: String,
            city: String,
            postalCode: String,
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

/*
 * @desc: create a model using user schema
 * @param {string} modelName - model name
 * @param {object} userSchema - user schema
 */
module.exports = mongoose.model('User', userSchema);

