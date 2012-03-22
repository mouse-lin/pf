class Student < Person
  belongs_to :classes
  has_many :course_scores

  def detail
    
  end
  
end

