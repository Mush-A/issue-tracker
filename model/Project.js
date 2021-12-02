const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Path `project name` is required."]
  },
  issues: [
    {
      _id: Schema.Types.ObjectId,
      issue_title: {
        type: String,
        required: [true, "required field(s) missing"]
      },
      issue_text: {
        type: String,
        required: [true, "required field(s) missing"]
      },
      created_on: String,
      updated_on: String,
      created_by: {
        type: String,
        required: [true, "required field(s) missing"]
      },
      assigned_to: {
        type: String,
        default: ''
      },
      open: Boolean,
      status_text: {
        type: String,
        default: ''
      }
    }
  ] 
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;