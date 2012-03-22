class AddGradeToCourseScore < ActiveRecord::Migration
  def self.up
    add_column :course_scores, :grade, :string
  end

  def self.down
    remove_column :course_scores, :grade
  end
end
