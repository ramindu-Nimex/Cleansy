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
   TaskName: {
      type: String,
      required: true,
   },
   WorkGroupID: {
      type: String,
      required: true,
   },
   Date: {
      type: Date,
      required: true,
   },
   Location: {
      type: String,
      required: true,
   },
   Duration: {
      type: Number,
      required: true,
   },
  
}, {timestamps:true});

const TaskAssign = mongoose.model('TaskAssign', TaskAssignSchema);
export default TaskAssign;