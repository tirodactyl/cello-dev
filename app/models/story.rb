class Story < ActiveRecord::Base
  STORY_TYPES = %w(feature bug task release)
  STORY_STATES = %w(fresh estimated started finished delivered rejected completed)
  
  validates :title, :story_type, :story_state, presence: true
  validates :project, :requester, presence: true
  validates :story_type, inclusion: { in: STORY_TYPES }
  validates :story_state, inclusion: { in: STORY_STATES }
  validates :story_points, presence: true, if: :estimated?
  validates :owner, presence: true, if: :started?
  with_options if: :completed? do |completed|
    completed.validates :date_completed, :iteration, presence: true
  end
  
  before_validation :ensure_story_state!
  
  # Following associations built during model creation.
  belongs_to :requester, {
    class_name: "User",
    foreign_key: :requester_id,
    inverse_of: :requested_stories
  }
  belongs_to :project, inverse_of: :stories
  
  # Following association built during start event.
  belongs_to :owner, {
    class_name: "User",
    foreign_key: :owner_id,
    inverse_of: :owned_stories
  }
  
  # Following association built during completion event.
  # belongs_to :iteration, inverse_of: :stories
  
  
  #NOTE that bugs must be delivered and accepted (like features)
  #NOTE that tasks and releases are completed when finished
  #NOTE that bugs, tasks, and releases have point values of 0
  #NOTE that while a feature is in the icebox it is fresh and immediately started upon movement to backlog(has finish button)
  
  
  def estimated?
    self.story_state != 'fresh'
  end
  def started?
    !%w(estimated fresh).include?(self.story_state)
  end
  def completed?
    self.story_state == 'completed'
  end
  
  private
  def ensure_story_state!
    self.story_state ||= 'fresh'
  end
end
