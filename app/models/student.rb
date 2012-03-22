# -*- encoding : utf-8 -*-

class Student < Person
  belongs_to :classes
  has_many :course_scores

  def total_score
    course_scores.sum(:score)
  end

  def grade
    '优秀'
  end
end

