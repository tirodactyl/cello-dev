Tracker.Views.CompositeView = Backbone.View.extend({
  subviews: function (selector) {
    this._subviews = this._subviews || {};
    if (!selector) {
      return this._subviews;
    } else {
      this._subviews[selector] = this._subviews[selector] || [];
      return this._subviews[selector];
    }
  },
  
  remove: function () {
    _(this.subviews()).each(function (subviews) {
      _(subviews).each(function (subview) { subview.remove(); });
    });
    return Backbone.View.prototype.remove.call(this);
  },
  
  // Adding a subview renders it as well.
  addSubview: function (selector, subview, options) {
    this.subviews(selector).push(subview.render());
    if (options && options.reAttach) {
      this.attachSubviews();
    } else {
      this.attachSubview(selector, subview);
    }
  },

  attachSubview: function (selector, subview) {
    this.$(selector).append(subview.$el);
    subview.delegateEvents();
    
    if (subview.attachSubviews) {
      subview.render();
    }
  },

  // This method should be included in the render method of each CompositeView
  attachSubviews: function () {
    var view = this;
    _(this.subviews()).each(function (subviews, selector) {
      view.$(selector).empty();
      if (view.compareBy) {
        subviews.sort(view.compareBy);
      }
      _(subviews).each(function (subview) {
        view.attachSubview(selector, subview);
      });
    });
  },
  
  // compareBy: function (subviewA, subviewB) {
  //   var result = subviewA.model.get('rank') - subviewB.model.get('rank');
  //   if (result === 0) { return -1 } else { return result };
  // },
  
  removeSubview: function (selector, subview) {
    subview.remove();
    var subviews = this.subviews(selector);
    subviews.splice(subviews.indexOf(subview), 1);
  },
});