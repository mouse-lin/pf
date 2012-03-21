class ApplicationController < ActionController::Base
  #目前暂时取消登录界面
  #before_filter :authenticate_user!
  layout :render_by_login_session
  protect_from_forgery
  def render_by_login_session
    is_a?(Devise::SessionsController) ? "login" : "application"
  end
end
