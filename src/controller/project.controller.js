import mongoose from "mongoose";
import Project from "../models/project.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const createProject = async (req, res) => {
  try {
    const { name, description, endDate, users, createdBy } = req.body;

    if (!name || !users) {
      return res.status(400).json({
        message: "Project name & assign employees are mandatory",
        success: false,
      });
    }

    const existingProject = await Project.findOne({ name });

    if (existingProject) {
      return res.status(400).json({
        message: "Project name is already taken",
        success: false,
      });
    }

    const project = await Project.create({
      name,
      description,
      endDate,
      users,
      createdBy,
    });

    res.status(200).json({
      data: project,
      message: "Project created successfully",
      success: true,
    });
  } catch (error) {
    console.log("Fail to create project", error);
  }
};

export const getProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const userType = req.cookies["userType"];

    let projects = [];
    if (userType === "admin") {
      projects = await Project.aggregate([
        {
          $match: {
            createdBy: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $project: {
            "users._id": 0,
            "users.password": 0,
            "users.userType": 0,
            "users.adminId": 0,
            "users.createdAt": 0,
            "users.updatedAt": 0,
            "users.__v": 0,
          },
        },
      ]);
    } else {
      projects = await Project.aggregate([
        {
          $match: {
            users: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $project: {
            "users._id": 0,
            "users.password": 0,
            "users.userType": 0,
            "users.adminId": 0,
            "users.createdAt": 0,
            "users.updatedAt": 0,
            "users.__v": 0,
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.log("Fail to get projects", error);
  }
};

export const updateProject = async (req, res) => {
  try {
    const data = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (updateProject) {
      res.status(200).json({
        success: true,
        data: updatedProject,
        message: "project updated successfully",
      });
    }
  } catch (error) {
    console.log("Fail to update project", error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userType = req.cookies["userType"];

    if (userType === "admin") {
      await Project.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } else {
      return res.status(400).json({
        message: "User don't have rights to delete project",
        success: false,
      });
    }
  } catch (error) {
    console.log("Fail to delete project", error);
  }
};
