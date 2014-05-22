class CreateStories < ActiveRecord::Migration
  def change
    create_table :stories do |t|
      t.string :title, null: false
      t.string :description
      t.string :story_type, null: false
      t.string :story_state, null: false
      t.integer :story_points
      t.integer :project_id, null: false
      t.integer :requester_id, null: false
      t.integer :owner_id
      t.integer :iteration_id
      t.date :date_completed

      t.timestamps
    end
    add_index :stories, :project_id
    add_index :stories, :requester_id
    add_index :stories, :owner_id
    add_index :stories, :iteration_id
  end
end
