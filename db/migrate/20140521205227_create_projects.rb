class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.integer :owner_id, null: false

      t.timestamps
    end
    add_index :projects, :owner_id
  end
end