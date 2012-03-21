class CreateCourseScores < ActiveRecord::Migration
  def self.up
    create_table :course_scores do |t|
      t.integer :person_id
      t.integer :course_id
      t.integer :score

      t.timestamps
    end
  end

  def self.down
    drop_table :course_scores
  end
end
