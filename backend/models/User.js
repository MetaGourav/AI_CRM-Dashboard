import mangoose from 'mongoose';
import bycrpt from 'bcryptjs';  

const userSchema = mangoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            maxlength: [100, 'Password cannot exceed 100 characters'],
            select:false,
        },
        role: {
            type: String,
            enum: ['owner', 'member'],
            default: 'owner',
        },
        company: {type: String,trim: true, default: ""},
        avatar: {type: String,default: ""},
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bycrpt.genSalt(10);
    this.password = await bycrpt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bycrpt.compare(enteredPassword, this.password);
};

export default mangoose.model('User', userSchema);

