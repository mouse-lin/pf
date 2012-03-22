class RenamePersonToStudentInCourseScore < ActiveRecord::Migration
  def self.up
    rename_column :course_scores, :person_id, :student_id
  end

  def self.down
    rename_column :course_scores, :student_id, :person_id
  end
end
