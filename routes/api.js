'use strict';
const mongoose = require('mongoose')
const Project = require('../model/Project.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      
      try{
        // Find if project with this name exists
        let existingProject = await Project.findOne({name: project});

        // If Project does not exist, create one 
        if (!existingProject) {
          existingProject = await Project.create({
            name: project
          })
        }
        
        // filter below.....
        if (req.query._id) {
          existingProject.issues = existingProject.issues.filter(obj => obj._id.toString() == req.query._id)
        }
        if (req.query.issue_title) {
          existingProject.issues = existingProject.issues.filter(obj => obj.issue_title == req.query.issue_title)
        }
        if (req.query.issue_text) {
          existingProject.issues = existingProject.issues.filter(obj => obj.issue_text == req.query.issue_text)
        }
        if (req.query.open) {
          existingProject.issues = existingProject.issues.filter(obj => obj.open.toString() == req.query.open)
        }
        if (req.query.assigned_to) {
          existingProject.issues = existingProject.issues.filter(obj => obj.assigned_to == req.query.assigned_to)
        }
        if (req.query.status_text) {
          existingProject.issues = existingProject.issues.filter(obj => obj.status_text == req.query.status_text)
        }        
        if (req.query.created_by) {
          existingProject.issues = existingProject.issues.filter(obj => obj.created_by == req.query.created_by)
        }      
        if (req.query.created_on) {
          existingProject.issues = existingProject.issues.filter(obj => obj.created_on == req.query.created_on)
        }        
        if (req.query.updated_on) {
          existingProject.issues = existingProject.issues.filter(obj => obj.updated_on == req.query.updated_on)
        }        


        // If Project exists, return its issue array
        return res.status(200).json(existingProject.issues);

      } catch(err) {
        // Return error
        return res.status(200).json(err);        
      }
    })
    
    .post(async function (req, res){
      let project = req.params.project;

      // Create new issue with posted content
      let issue = {
        assigned_to: "",
        status_text: "",
        ...req.body,
        _id: mongoose.Types.ObjectId(),
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true,
      }

      try {
        // Find if project with this name exists
        let existingProject = await Project.findOne({name: project});

        // If Project does not exist, create one 
        if (!existingProject) {
          existingProject = await Project.create({
            name: project
          })
        }

        // Update the issue array
        await existingProject.issues.push(issue);

        // Save the project
        await existingProject.save();

        // Return issue
        return res.json(issue);

      } catch(err) {
        // Return error
        if (err.name == 'ValidationError') {
          const message = err.errors[Object.keys(err.errors)[0]].message;
          return res.json({error: message}); 
        } else {
          return res.json(err);
        }
      }
    })
    
    .put(async function (req, res){
      let project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: 'missing _id' })
      }
      
      try{
        // Find if project with this name exists
        let existingProject = await Project.findOne({name: project}).lean();

        // If project does not exist, return
        if (!existingProject) {
          return res.json({ error: 'could not update', _id: req.body._id })
        }

        // Filter off empty fields
        Object.keys(req.body).map(key => {
          if (!req.body[key]) {
            delete req.body[key]
          }
        })

        // If the the only thing left after filtering is the id, return
        if (Object.keys(req.body).length == 1 && req.body._id != null) {
          return res.json({ error: 'no update field(s) sent', _id: req.body._id })
        }

        // If project exists, get the issues from array
        let issues = existingProject.issues;

        // Find index of object in array
        let index = issues.findIndex(obj => obj._id.toString() == req.body._id);

        // If issue does not exist, return
        if (index === -1) {
          return res.json({ error: 'could not update', _id: req.body._id })
        }

        // Update object
        issues[index] = {
          ...issues[index],
          ...req.body,
          updated_on: new Date().toISOString()
        };

        // Save the updated object
        await Project.updateOne({_id: existingProject._id}, existingProject);

        // If Project exists, return its issue array
        return res.json({ result: 'successfully updated', _id: req.body._id });

      } catch(err) {
        // Return error
        return res.json({ error: 'could not update', _id: req.body._id });        
      }
    })
    
    .delete(async function (req, res){
      let project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: 'missing _id' })
      }
      
      try {
        // Find if project with this name exists
        let existingProject = await Project.findOne({name: project});

        // Find issue
        let obj = existingProject.issues.find(obj => obj._id.toString() == req.body._id)
        
        // If issue does not exist send error, else delete it
        if (obj) {
          existingProject.issues.pull({_id: req.body._id})
        } else {
          return res.json({ error: 'could not delete', _id: req.body._id })
        }

        // Save the project
        await existingProject.save();

        // Return issue
        return res.json({ result: 'successfully deleted', _id: req.body._id });

      } catch (err) {
        res.json({ error: 'could not delete', _id: req.body._id })
      }
    });
    
};
