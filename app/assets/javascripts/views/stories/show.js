Tracker.Views.StoryShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'story-show',
  template: JST['stories/show'],
  buttonTemplate: JST['stories/state_buttons'],
  render: function () {
    this.$el.html(this.template({
      story: this.model
    }));
    
    this.$('.story-buttons').append(this.buttonTemplate({
      story: this.model
    }));
    
    if (!this.model.id && !this.formView) { this.toggleForm(); }
    
    if (this.formView) { this.togglePreview(); }
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function () {
    this.$el.addClass(this.model.get('story_state'));
    this.$el.attr('data-rank', this.model.get('story_rank'));
    if(this.model.id) { this.$el.attr('data-id', this.model.id); }
    this.listenTo(this.model, 'sync', this.saveActions);
  },
  events: {
    'click .init-edit': 'expandForm',
    'click .cancel-edit': 'toggleForm',
    'dblclick .story-preview': 'expandForm',
    'click .story-start': 'changeStateStart',
    'click .story-finish': 'changeStateFinish',
    'click .story-deliver': 'changeStateDeliver',
    'click .story-reject': 'changeStateReject',
    'click .story-accept': 'changeStateAccept',
    'click .story-restart': 'changeStateStart',
  },
  changeStateStart: function () {
  this.changeState('started');
  },
  changeStateFinish: function () {
  this.changeState('finished');
  },
  changeStateDeliver: function () {
  this.changeState('delivered');
  },
  changeStateReject: function () {
    this.changeState('rejected');
  },
  changeStateAccept: function () {
    this.changeState('accepted');
  },
  changeState: function (newState) {
    var view = this;
    var oldState = this.model.get('story_state')
    this.model.set('story_state', newState);
    this.model.save({
      success: function () {
        view.$el.toggleClass(newState + ' ' + oldState)
      }
    }); 
  },
  saveActions: function () {
    this.$el.attr('data-id', this.model.id);
    this.$el.attr('data-rank', this.model.get('story_rank'));
    if (this.formView) { this.expandForm(); }
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