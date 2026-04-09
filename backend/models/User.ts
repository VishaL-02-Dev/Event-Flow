import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isDeleted:boolean;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: {type: String, required:true},
        email: {type: String, required:true, unique:true, lowercase:true},
        password: {type: String, required:true},
        isAdmin: {type:Boolean, default:false},
        isDeleted:{type:Boolean,default:false}
    },
    {timestamps: true}
);

UserSchema.pre('save', async function () {
    const user = this as IUser;

    if (!user.isModified('password')) return;

    user.password = await bcrypt.hash(user.password, 12);
});
UserSchema.methods.comparePassword = async function (this: IUser, candidate: string) {
    return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);