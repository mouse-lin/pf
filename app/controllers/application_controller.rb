class ApplicationController < ActionController::Base
  #目前暂时取消登录界面
  #before_filter :authenticate_user!
  layout :render_by_login_session
  protect_from_forgery
  def render_by_login_session
    is_a?(Devise::SessionsController) ? "login" : "application"
  end

  def render_error(error_msg = "",content_type = "application/json")
    logger.info "==Render error : #{error_msg.inspect}=="
    respond_to do |format|
      format.js   { render :js => "throw '#{error_msg}';" , :status => :bad_request }
      format.html { render :text => error_msg, :status => :bad_request }
      format.json do
        is_active_record = error_msg.is_a? ActiveRecord::Base
        content = {
          :active_record_error => is_active_record,
          :error_msg => is_active_record ? error_msg.errors.full_messages.join("<br />") : error_msg
        }
        render :json => { :success => false, :message => content }, :status => :bad_request, :content_type => content_type
        #前台调用: Ext.decode(resp.responseText).message.error_msg
      end
    end
  end

  def render_json(content, content_type = "application/json")
    render :json => { :success => true, :root => content }, :status => :ok, :content_type => content_type
  end

  def fields_provider
    #生成代码块,还用到插件解析fields
    Proc.new { |o| o.provide params[:fields] }
  end
  
end
