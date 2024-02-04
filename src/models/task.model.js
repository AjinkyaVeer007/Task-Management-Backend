import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    endDate: {
      type: Date,
      default: null,
    },
    assignUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ids are mandatory"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project id is mandatory"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
