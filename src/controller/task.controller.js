import mongoose from "mongoose";
import Task from "../models/task.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const createTask = async (req, res) => {
  try {
    const { title, description, endDate, assignBy, assignTo, projectId } =
      req.body;

    if (!title || !assignTo) {
      return res.status(400).json({
        success: false,
        message: "Task name and assign any user is mandatory",
      });
    }

    const task = await Task.create({
      title,
      description,
      endDate,
      assignBy,
      assignTo,
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

export const getTasks = async (req, res) => {
  try {
    const userType = req.cookies["userType"];
    const { projectId, userId } = req.params;

    let tasklist = [];
    if (userType === "admin") {
      tasklist = await Task.aggregate([
        {
          $match: {
            projectId: new ObjectId(projectId),
            assignBy: new ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "$assignTo",
            tasklist: {
              $push: "$_id",
            },
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "tasklist",
            foreignField: "_id",
            as: "tasklist",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "tasklist.assignTo",
            foreignField: "_id",
            as: "assignTo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "tasklist.assignBy",
            foreignField: "_id",
            as: "assignBy",
          },
        },
        {
          $unwind: {
            path: "$assignTo",
          },
        },
        {
          $unwind: {
            path: "$assignBy",
          },
        },
        {
          $project: {
            "tasklist.assignTo": 0,
            "tasklist.assignBy": 0,
            "tasklist.projectId": 0,
            "tasklist.createdAt": 0,
            "tasklist.updatedAt": 0,
            "tasklist.__v": 0,
            "assignTo._id": 0,
            "assignTo.password": 0,
            "assignTo.adminId": 0,
            "assignTo.userType": 0,
            "assignTo.createdAt": 0,
            "assignTo.updatedAt": 0,
            "assignTo.__v": 0,
            "assignBy._id": 0,
            "assignBy.password": 0,
            "assignBy.adminId": 0,
            "assignBy.userType": 0,
            "assignBy.createdAt": 0,
            "assignBy.updatedAt": 0,
            "assignBy.__v": 0,
          },
        },
      ]);
    } else {
      tasklist = await Task.aggregate([
        {
          $match: {
            projectId: new ObjectId(projectId),
            assignTo: new ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "$assignTo",
            tasklist: {
              $push: "$_id",
            },
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "tasklist",
            foreignField: "_id",
            as: "tasklist",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "tasklist.assignTo",
            foreignField: "_id",
            as: "assignTo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "tasklist.assignBy",
            foreignField: "_id",
            as: "assignBy",
          },
        },
        {
          $unwind: {
            path: "$assignTo",
          },
        },
        {
          $unwind: {
            path: "$assignBy",
          },
        },
        {
          $project: {
            "tasklist.assignTo": 0,
            "tasklist.assignBy": 0,
            "tasklist.projectId": 0,
            "tasklist.createdAt": 0,
            "tasklist.updatedAt": 0,
            "tasklist.__v": 0,
            "assignTo._id": 0,
            "assignTo.password": 0,
            "assignTo.adminId": 0,
            "assignTo.userType": 0,
            "assignTo.createdAt": 0,
            "assignTo.updatedAt": 0,
            "assignTo.__v": 0,
            "assignBy._id": 0,
            "assignBy.password": 0,
            "assignBy.adminId": 0,
            "assignBy.userType": 0,
            "assignBy.createdAt": 0,
            "assignBy.updatedAt": 0,
            "assignBy.__v": 0,
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: tasklist,
      message: "Task list fetch successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { isCompleted, link } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
      isCompleted,
      link,
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userType = req.cookies["userType"];

    if (userType === "admin") {
      await Task.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "Task Deleted successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "User don't have rights to delete task",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
