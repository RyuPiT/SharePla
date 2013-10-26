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
    pdf = WickedPdf.new.pdf_from_string('<h1>hello</h1><h1>hello</h1><h1>hello</h1>')
    save_path = Rails.root.join('tmp/pdf', 'ticket.pdf')
    File.open(save_path, 'wb') do |file|
      file << pdf
    end
    
    # download pdf file
    send_file('tmp/pdf/ticket.pdf') 
#    render :nothing => true
  end
end
