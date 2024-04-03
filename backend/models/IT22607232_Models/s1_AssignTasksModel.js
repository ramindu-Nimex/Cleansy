import mongoose from "mongoose";

const TaskAssignSchema = new mongoose.Schema({
  TaskID: {
      type: String,
      required: true,
   },
   Category: {
      type: String,
      required: true,
   },
   Name: {
      type: String,
      required: true,
   },
   Description: {
      type: String,
      required: true,
   },
   WorkGroupID: {
      type: String,
      required: true,
   },
   Location: {
      type: String,
      required: true,
   },
   DurationDays: {
      type: Number,
      required: true,
   }
 
}, {timestamps:true});


const TaskAssign = mongoose.model('TaskAssign', TaskAssignSchema);
export default TaskAssign;