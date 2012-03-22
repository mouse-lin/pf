class StudentsController < ApplicationController
  #获取学生信息
  def get_all_students
    students = []
    Student.all.each do  |s|
      students.push(s.attributes.merge!({
        :class_name => s.classes.try(:name)
      }))
    end
    render_json students
  end
end
