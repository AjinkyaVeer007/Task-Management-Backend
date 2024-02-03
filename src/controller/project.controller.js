import Project from "../models/project.model";

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

    await Project.create({
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
