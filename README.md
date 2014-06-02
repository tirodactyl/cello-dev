#README

Check out the live demo site [here](http://www.cello-dev.com).

This is a clone of [PivotalTracker](http://www.pivotaltracker.com) by [PivotalLabs](http://pivotallabs.com/).

Having used a variety of task-management type software over the last several years, I decided it would be worthwhile for me to build my own and incorporate the features I found most essential. I built this with PivotalTracker in mind, though I had not used PivotalTracker in a professional context and this came about through a conversation where I described my ideal task management app - and was then pointed to Pivotal...

A few notes on the technologies utilized in this build:
- Ruby on Rails backend with standard WeBrick server and PostgreSQL database
  - RESTful API designed to offload front-end rendering to Backbone.js
  - Server-side processing ensures that API is robust while limiting the front-end complexity by automatic processing of defaulted fields
- Front-end MV framework with Backbone.js
  - Quadruply nested Backbone views rendering EJS templates to the DOM
  - Subviews utilize collection filtering to allow all models/views to listen upon the same collection and update accordingly
  - Drag and drop functionality depends upon updating records within several contexts at once
    - Extensive use of JS listeners and triggers to notify appropriate Backbone.js views of changes to the DOM
- Clean front-end design with simple toggling of view components and inline editing for tasks (stories) in each project
  - Clear color-coded designations for stories in different stages to allow at-a-glance evaluation
  - Muted color-scheme is easy on the eyes without sacrificing contrast and contextual information
