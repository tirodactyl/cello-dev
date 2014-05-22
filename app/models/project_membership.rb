class ProjectMembership < ActiveRecord::Base
  validates :user, :project, presence: true
  belongs_to :user, class_name: "User", inverse_of: :memberships
  belongs_to :project, class_name: "Project", inverse_of: :memberships
end
