Tracker.Views.StoryShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'story-show',
  template: JST['stories/show'],
  render: function () {
    this.$el.html(this.template({
      story: this.model
    }));
    
    if (!this.model.id && !this.formView) {
      this.toggleForm();
    }
    
    if(this.formView) {
      this.togglePreview();
    }
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function () {
    $(this).data('rank', this.model.get('story_rank'));
    this.listenTo(this.model, 'sync', this.saveActions);
  },
  events: {
    'click .init-edit': 'expandForm',
    'click .cancel-edit': 'toggleForm',
    'dblclick .story-preview': 'expandForm'
  },
  saveActions: function () {
    $(this).data('id', this.model.id);
    this.render();
  },
  expandForm: function () {
    this.togglePreview();
    this.toggleForm();
  },
  togglePreview: function () {
    this.$('.init-edit').toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    this.$('.story-preview').toggleClass('show hidden');
  },
  toggleForm: function () {
    if (!this.formView) {
      this.formView = new Tracker.Views.StoryForm({
        model: this.model,
        collection: this.collection
      });
      this.listenTo(this.formView, 'submit', this.toggleEdit);
      this.addSubview('.story-body', this.formView);
    } else {
      this.removeSubview('.story-body', this.formView);
      this.formView = undefined;
    }
    
    if (!this.model.id) {
      this.trigger('cancelCreate', this)
    }
  }
  // addProject: function (project) {
  //   this.render();
  // },
  // removeProject: function (project) {
  //   var selector = 'li.project#' + project.id;
  //   $(this).find(selector).remove();
  //   this.render();
  // }
});