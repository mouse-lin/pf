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

  #删除学生
  def destroy_student
    Student.find(params[:id]).delete
    render_json "success"
  end

  #保存学生更新
  def update_student
      data = { 
        :number => params["number"],
        :sex => params["sex"], 
        :phone => params["phone"],
        :home => params["home"],
        :name => params["name"],
      }
      data["image"] = params["photo"] if(params["photo"])
      params["id"] == "save"? Student.create(data) : Student.find(params["id"]).update_attributes!(data)
      render_json "success", "text/html"
   rescue => e
      render_error e.message,'text/html'
  end

end
