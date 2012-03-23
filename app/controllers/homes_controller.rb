class HomesController < ApplicationController
  def index
  end

  def get_students
    code = "Student.number_like(params[:query])"
    result = eval( params[:c_id] ? code + ".classes_id_equals(params[:c_id])" : code)
    total = result.count
    result = result.order("#{params[:sort]} #{params[:dir]}").limit((params[:limit] || 25).to_i).offset(params[:start].to_i || 0).collect &fields_provider
    render :json => { :root => result, :total => total }
  end

  def get_classes
    render_json Classes.where("name like ?", "%#{params[:query]}%").collect &fields_provider
  end

  def student_detail
    render_json Student.find(params[:s_id]).detail
  end

  def student_score
    render_json Student.find(params[:s_id]).course_scores.collect &fields_provider
  end

  def comment_student
  end

  def comment_type_tree_nodes
    render :json => CommentType.tree_nodes
  end

  def commets_by_type
    result = CommentType.find(params[:ct_id]).comments.content_like(params[:query])
    total = result.count
    result = result.order("#{params[:sort]} #{params[:dir]}").limit((params[:limit] || 15)).offset(params[:start].to_i || 0).collect &fields_provider
    render :json => { :root => result, :total => total }
  end

end
