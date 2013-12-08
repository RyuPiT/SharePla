class ApplicationController < ActionController::Base
  # using nokogiri, Travis is not unstable.
  require 'nokogiri'
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  def render_to_pdf
    search_wards = Array['.navbar-header','ul.nav.navbar-nav.navbar-right','.sns-button','#btn-clone','#btn-pdf']
    meta = '<meta http-equiv="content-type" content="text/html; charset=utf-8" />'
    body = render_to_string formats: :html
    doc = Nokogiri::HTML(body)
    search_wards.each do |ward|
      doc.css(ward).remove
    end
    html = meta + doc.to_html
    pdf  = WickedPdf.new.pdf_from_string(html)
  end

  def login_required
    if session[:user_id]
      @current_user = User.find_by(uid: session[:user_id])
    else
      redirect_to root_path
    end
  end
end
