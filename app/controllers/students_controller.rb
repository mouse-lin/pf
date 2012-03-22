class StudentsController < ApplicationController
  #获取学生信息
  def get_all_students
    students = Student.all.collect &fields_provider
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

  def student_total_score
    render_json Student.find(params[:s_id]).total_score_by_grade
  end

  def destroy_student
    Student.find(params[:id]).delete
    render_json "success"
  end

end
