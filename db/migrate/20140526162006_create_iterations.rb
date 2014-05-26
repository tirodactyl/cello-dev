class CreateIterations < ActiveRecord::Migration
  def change
    create_table :iterations do |t|
      t.integer :project_id
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
    add_index :iterations, :project_id
    
    add_column :projects, :current_iteration_id, :integer
  end
end
