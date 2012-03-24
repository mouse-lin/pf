class StudentsController < ApplicationController
  layout"application", :except => [ :print ]
  #获取学生信息
  def get_all_students
    people = Person.all.collect &fields_provider
    render_json people
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
    Person.find(params[:id]).delete
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
        :classes_id => params["classes_id"]
      }
      data["image"] = params["photo"] if(params["photo"])
      if params["id"] == "save"
        params[:type] == "Student"? Student.create(data) : Teacher.create(data) 
      else
        Person.find(params["id"]).update_attributes!(data)
      end
      render_json "success", "text/html"
   rescue => e
      render_error e.message,'text/html'
  end

  def update_score
    params[:jsonData].each do |j|
      j.delete("course/name")
    end
    Student.find(params[:studentId]).update_attributes({ :course_scores_attributes => params[:jsonData]})
    render_json "success"
  rescue => e
    render_error e.message
  end

  def print
    @student = Student.find(params[:id])
  end
end
