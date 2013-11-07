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
end
