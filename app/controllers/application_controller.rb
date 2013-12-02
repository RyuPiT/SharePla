class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  def render_to_pdf
    meta = '<meta http-equiv="content-type" content="text/html; charset=utf-8" />'
    body = render_to_string formats: :html
    html = meta + body
    pdf  = WickedPdf.new.pdf_from_string(html)
  end

  def login_required
    if session[:user_id]
      @current_user = User.find_by(uid: session[:user_id])
    else
      redirect_to root_path
    end
  end

  helper_method :current_user

  private
  def current_user
    @current_user ||= User.find_by(uid: session[:user_id]) if session[:user_id]
  end
end
