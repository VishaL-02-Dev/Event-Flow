import mongoose,{Document,Schema} from "mongoose";
export interface IGuest extends Document{
    name:string;
    email?:string;
    phone?:string;
    groupSize:number;
    eventId:mongoose.Types.ObjectId;
    entryToken:string;
    checkedIn:boolean;
    checkInAt?:Date;
    registeredAt:Date;
    isDeleted?:boolean;

}

const GuestSchema=new Schema<IGuest>({
name:{
type:String,required:true
},
email:{
type:String
},
phone:{
    type:String
},
groupSize:{
    type:Number,required:true
},
eventId:{
    type:Schema.Types.ObjectId,ref:'Event',required:true
},
entryToken:{
    type:String,required:true
},
checkedIn:{
    type:Boolean,required:true
},
checkInAt:{
    type:Date
},
registeredAt:{
    type:Date,
    required:true
},
isDeleted:{
    type:Boolean,
    default:false
}

},{timestamps:true})

export default mongoose.model('Guest',GuestSchema)