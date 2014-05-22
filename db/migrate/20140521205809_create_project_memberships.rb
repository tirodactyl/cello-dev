class CreateProjectMemberships < ActiveRecord::Migration
  def change
    create_table :project_memberships do |t|
      t.integer :user_id
      t.integer :project_id

      t.timestamps
    end
    add_index :project_memberships, :user_id
    add_index :project_memberships, :project_id
  end
end
