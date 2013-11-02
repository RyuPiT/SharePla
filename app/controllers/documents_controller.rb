require 'tmpdir'
class DocumentsController < ApplicationController
  def sample
    render :pdf => "newplan", :layout =>false, :template => "/top/static.html", :encoding => "UTF-8"
  end

  def create
    p params[:uri]
    render :nothing => true
    # render :pdf => "newplan", :layout =>false, :template => params[:uri], :encoding => "UTF-8"
  end

  def string
    @plan = Plan.find(params['id'])
    meta = '<meta http-equiv="content-type" content="text/html; charset=utf-8" />'
    body = render_to_body :template => 'top/show'
    html = meta + body
    pdf  = WickedPdf.new.pdf_from_string(html)

    pdf_name  = "#{@plan.id}.pdf"
    save_path = "#{Dir.mktmpdir}/#{pdf_name}"
    File.open(save_path, 'wb') do |file|
      file << pdf
    end

    send_data File.read(save_path),
              :filename => pdf_name, :disposition => 'inline'
  end
end

