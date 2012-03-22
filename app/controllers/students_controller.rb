class StudentsController < ApplicationController
  #获取学生信息
  def get_all_students
    students = Student.all.collect &fields_provider
    #Student.all.each do  |s|
    #  students.push(s.attributes.merge!({
    #    :class_name => s.classes.try(:name)
    #  }))
    #end
    render_json students
  end


  def update_student_comment
    s = Student.find(params[:id])
    if s.update_attribute(:comment, params[:comment])
      render_json "success"
    else
      render_error s.errors
    end
  end
end
