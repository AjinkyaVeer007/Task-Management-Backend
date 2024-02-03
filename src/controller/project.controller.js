import Project from "../models/project.model.js";
import Project_Users_Link from "../models/projectUsersLink.model.js";

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
    });

    await Project_Users_Link.create({
      projectId: project._id,
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

    const projectIds = await Project_Users_Link.find(
      { users: userId },
      { projectId: 1 }
    );

    const projects = await Project.aggregate([
      {
        $match: {
          _id: {
            $in: projectIds.map((entry) => entry.projectId),
          },
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.log("Fail to get projects", error);
  }
};
