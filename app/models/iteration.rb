class Iteration < ActiveRecord::Base
  validates :project, :start_date, :end_date, :velocity, presence: true
  before_validation :ensure_dates!, :ensure_velocity!
  
  belongs_to :project, inverse_of: :iterations
  
  has_many :stories, inverse_of: :iteration
  
  private
  def ensure_velocity!
    self.velocity ||= 10
  end
  def ensure_dates!
    unless self.start_date
      time = Time.new.localtime
      debugger
      until time.sunday? do
        time -= 1.days
      end
      self.start_date = Time.local(time.year, time.month, time.day, 0, 0, 0)
    end
    unless self.end_date
      self.end_date = self.start_date + 7.days - 1.seconds
    end
  end
  # PS: this is how many seconds are in a week: 604800
end
