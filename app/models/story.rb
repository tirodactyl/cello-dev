class Story < ActiveRecord::Base
  STORY_TYPES = %w(feature bug task release)
  STORY_STATES = %w(unscheduled unstarted started finished delivered rejected accepted)
  
  validates :title, :story_type, :story_state, presence: true
  validates :project, :requester, presence: true
  validates :story_type, inclusion: { in: STORY_TYPES }
  validates :story_state, inclusion: { in: STORY_STATES }
  with_options if: :started? do |started|
    started.validates :owner, :story_points, presence: true
  end
  with_options if: :accepted? do |accepted|
    accepted.validates :date_completed, :iteration, presence: true
    accepted.before_validation :ensure_date_completed!
  end
  
  before_validation :ensure_story_state!
  
  # Following associations built during model creation.
  belongs_to :requester, {
    class_name: "User",
    foreign_key: :requester_id,
    inverse_of: :requested_stories
  }
  belongs_to :project, inverse_of: :stories
  
  # Following association built when started.
  belongs_to :owner, {
    class_name: "User",
    foreign_key: :owner_id,
    inverse_of: :owned_stories
  }
  
  belongs_to :iteration, inverse_of: :stories
  

  
  
  #NOTE that bugs must be delivered and accepted (like features)
  #NOTE that tasks and releases are completed when finished
  #NOTE that bugs, tasks, and releases have point values of 0
  #NOTE that while a feature is in the icebox it is unscheduled and upon movement to backlog or another view it becomes unstarted
  
  
  def estimated?
    (self.story_type == 'feature') && self.story_points
  end
  def started?
    !%w(unscheduled unstarted).include?(self.story_state)
  end
  def accepted?
    self.story_state == 'accepted'
  end
  
  private
  def ensure_story_state!
    self.story_state ||= 'unscheduled'
  end
  def ensure_date_completed!
    self.date_completed ||= DateTime.now
  end
end
