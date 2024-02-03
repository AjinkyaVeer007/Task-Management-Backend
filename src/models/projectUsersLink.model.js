import mongoose from "mongoose";

const projectUsersLinkSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Project_Users_Link = mongoose.model(
  "Project_Users_Link",
  projectUsersLinkSchema
);

export default Project_Users_Link;
