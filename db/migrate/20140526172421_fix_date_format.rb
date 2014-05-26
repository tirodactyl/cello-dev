class FixDateFormat < ActiveRecord::Migration
  def up
    change_column :iterations, :start_date, :datetime
    change_column :iterations, :end_date, :datetime
    change_column :stories, :date_completed, :datetime
  end
  
  def down
    change_column :iterations, :start_date, :date
    change_column :iterations, :end_date, :date
    change_column :stories, :date_completed, :date
  end
end
