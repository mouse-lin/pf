class HomesController < ApplicationController
  def index
  end

  def get_classes_students
    render_json Classes.find(params[:c_id]).students.order("#{params[:sort]} #{params[:dir]}").collect &fields_provider
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
    render_json CommentType.find(params[:ct_id]).comments.collect &fields_provider
  end

end
