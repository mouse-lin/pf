class SettingsController < ApplicationController

  def index
  end

  #班别科目主档
  def classes
    respond_to do |wants|
      wants.html 
      wants.json do
        classes = Classes.all.collect &fields_provider
        render_json classes
      end
    end
  end

  def get_course
    course = Course.all.collect &fields_provider
    render_json course
  end

  #删除班级 
  def destroy_classes
    Classes.find(params[:id]).delete
    render_json "success"
  end

  #删除科目 
  def destroy_course
    Course.find(params[:id]).delete
    render_json "success"
  end

  #保存更新班级科目信息 | 评语类别、评语 添加更新
  def ajax_request 
    if params[:action_type] == "create"
      params[:object_type].constantize.create(params[:form_data])
    else
      params[:object_type].constantize.find(params[:id]).update_attributes(params[:form_data])
    end
    render_json "success"
  end

  def comment
    respond_to do |wants|
      wants.html 
      wants.json do
        comments = Comment.all.collect &fields_provider
        render_json comments
      end
    end
  end

  def comment_type
    if fields_provider
      comment_types = CommentType.all.collect &fields_provider
    else
      comment_types = CommentType.all
    end
    render_json comment_types
  end

  def destroy_comment
    Comment.find(params[:id]).delete
    render_json "success"
  end

  def destroy_comment_type
    CommentType.find(params[:id]).delete
    render_json "success"
  end
end
