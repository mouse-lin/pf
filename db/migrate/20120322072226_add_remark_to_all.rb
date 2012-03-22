class AddRemarkToAll < ActiveRecord::Migration
  def self.up
    add_column :classes, :remark, :string
    add_column :people, :remark, :string
    add_column :courses, :remark, :string
    add_column :score_types, :remark, :string
    add_column :course_scores, :remark, :string
    add_column :comments, :remark, :string
    add_column :comment_types, :remark, :string
  end

  def self.down
    remove_column :classes, :remark
    remove_column :people, :remark
    remove_column :courses, :remark
    remove_column :score_types, :remark
    remove_column :course_scores, :remark
    remove_column :comments, :remark
    remove_column :comment_types, :remark
  end
end
