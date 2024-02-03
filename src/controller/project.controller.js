import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, endDate, users } = req.body;

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
    });

    res.status(200).json({
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

    const projects = await Project.find({ users: userId });

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
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log("Fail to delete project", error);
  }
};
