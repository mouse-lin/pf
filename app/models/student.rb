# -*- encoding : utf-8 -*-

class Student < Person
  belongs_to :classes
  has_many :course_scores
  accepts_nested_attributes_for  :course_scores, :allow_destroy => true

  def total_score_by_grade
    gc = course_scores.group_by { |o| o.grade }
    gc.inject([]) { |arr, var| arr << { :grade => var[0], :total_score => var[1].sum(&:score) } }
  end

  def total_score
    course_scores.sum(:score)
  end

  def grade
    '优秀'
  end

end

