class Classes < ActiveRecord::Base
  has_many :students
  has_many :course_scores
end
