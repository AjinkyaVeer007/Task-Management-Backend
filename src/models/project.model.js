import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is mandatory"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
