
module ApplicationHelper
  def current_user
    @current_user ||= User.find_by(provider: session[:provider], uid: session[:user_id]) if session[:user_id]
  end
end
