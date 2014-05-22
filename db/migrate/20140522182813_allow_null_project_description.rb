class AllowNullProjectDescription < ActiveRecord::Migration
  def change
    change_column :projects, :description, :string, null: true
  end
end
