import mongoose from 'mongoose';
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true, "Name is required"],
        maxLength : [50, "Name Character Exceeds!"]
    },
    email : {
        type : String,
        lowercase : true,
        required : [true, "Email is required"],
        unique : [true, "Email is already registered!"],
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minLength : [6, "Please enter minimum 6 characters"],
        select : false
    }
}, {timestamps : true})

userSchema.pre("save", async function(next){
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password)
}


const userModel = mongoose.model('User', userSchema);

export default userModel;