import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, endDate, assignUser, projectId } = req.body;

    if (!title || !assignUser) {
      return res.status(400).json({
        success: false,
        message: "Task name and assign any user is mandatory",
      });
    }

    const task = await Task.create({
      title,
      description,
      endDate,
      assignUser,
      projectId,
    });

    res.status(200).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
