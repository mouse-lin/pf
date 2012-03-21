class ApplicationController < ActionController::Base
  #目前暂时取消登录界面
  #before_filter :authenticate_user!
  protect_from_forgery
end
