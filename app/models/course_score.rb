class CourseScore < ActiveRecord::Base
  belongs_to :course
  belongs_to :student

  def score_type
    ScoreType.where("begin <= ?", score).order("begin ASC").last.name
  end
end
