import TaskAssign from "../../models/IT22607232_Models/s1_AssignTasksModel.js";

//Create Task Assigning
export const TaskAssigning = async (req, res, next) => {
  try {
    const newTaskAssign = await TaskAssign.create(req.body);

    if (!newTaskAssign) {
      return res.status(404).json({ msg: "Task Assigning failed" });
    }
    return res
      .status(200)
      .json({ taskAssign: newTaskAssign, msg: "Task Assigned Successfully" });
  } catch (error) {
    next(error);
  }
};


//Get ALL Task Assiged
export const allTasks = async (req, res, next) => {
    try {
      const Scheduling = await TaskAssign.find();
      if (!Scheduling) {
        res.status(404).json({ msg: "Tasks not found" });
      }
      res.status(200).json(Scheduling);
    } catch (error) {
      next(error);
      res.status(500).json({ error: error });
    }
};


//get One Task by TaskID
export const oneTask = async (req, res,next) => {
  try {
    let taskid = req.params.taskid;
    const taskOne = await TaskAssign.findOne({TaskID: taskid});

    if (!taskOne) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(taskOne);
  } catch (error) {
    console.error("Error retrieving task:", error);
    next(error);
    return res.status(500).json({ error: "Internal server error" });
   
  }
};

/*//Update course by Admin
export const updateTask = async (req,res,next)=>{
  try{
    TaskAssign.findByIdAndUpdate({ taskid: req.params.taskid }, updateTask).then(result => {
      console.log(result);
      res.status(200).json({ message: "Successfully Task Updated" })
  })
}
catch (error) {
  console.error("Error retrieving task:", error);
  next(error);
  return res.status(500).json({ error: "Internal server error" });
 
}
}*/

// Update Task by Facility manager
export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskid;
    const updateTaskData = req.body; //declaring updated data

    const updatedTask = await TaskAssign.findByIdAndUpdate(taskId, updateTaskData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Successfully Task Updated", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    next(error); //pass error to error handling middleware
  }
};


//delete Tasks
export const deleteTask = async(req,res,next)=>{
  try{
    await TaskAssign.findByIdAndDelete(req.params.taskid)
    res.status(200).json({ message: "Successfully Deleted assigned task" })
  }
  catch (error){
    return res.status(500).json({msg: error.message})
  }
}
 
 