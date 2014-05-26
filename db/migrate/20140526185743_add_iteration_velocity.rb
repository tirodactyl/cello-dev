class AddIterationVelocity < ActiveRecord::Migration
  def change
    add_column :iterations, :velocity, :integer
  end
end
