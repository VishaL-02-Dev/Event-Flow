import mongoose,{Document,Schema} from "mongoose";

export interface IEvent extends Document{
    name:string;
    description?:string;
    location?:string;
    organizer: mongoose.Types.ObjectId;
    date:Date;
    inviteToken:string;
    createdAt:Date;
    isDeleted:boolean;
}

const EventSchema=new Schema<IEvent>({
name:{
    type:String,required:true
},
description:{
    type:String
},
location:{
    type:String
},
organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
date:{
    type:Date,required:true
},
inviteToken:{
    type:String,required:true,unique:true
},
isDeleted:{
    type:Boolean,
    default:false
}
},{timestamps:true})

export default mongoose.model<IEvent>('Event',EventSchema)