class CourseScore < ActiveRecord::Base
  belongs_to :course
  belongs_to :person
end
