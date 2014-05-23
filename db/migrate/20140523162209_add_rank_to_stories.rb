class AddRankToStories < ActiveRecord::Migration
  def change
    add_column :stories, :story_rank, :float, null: false
  end
end
