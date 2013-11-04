require 'tmpdir'
class DocumentsController < ApplicationController
  def sample
    render :pdf => "newplan", :layout =>false, :template => "/top/static.html", :encoding => "UTF-8"
  end

  def create
    render :nothing => true
  end

  def string
    @plan = Plan.find(params['id'])
    meta = '<meta http-equiv="content-type" content="text/html; charset=utf-8" />'
    body = render_to_body :template => 'top/show'
    html = meta + body
    pdf  = WickedPdf.new.pdf_from_string(html)
    send_data pdf, filename: "#{@plan.id}.pdf", disposition: 'inline'
  end
end

