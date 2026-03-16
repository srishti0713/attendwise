import mongoose from "mongoose";

const timetableSchema=new mongoose({
    semesterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Semester",
        required:true
    },
    day:{
        type:String,
        required:true
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    }
})

export const Timetable= mongoose.model("Timetable",timetableSchema)