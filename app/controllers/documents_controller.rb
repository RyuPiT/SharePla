class DocumentsController < ApplicationController

  def sample
    render :pdf => "newplan", :layout =>false, :template => "/newplan/index.html", :encoding => "UTF-8"
  end

  def create
    p params[:uri]
    render :nothing => true
#    render :pdf => "newplan", :layout =>false, :template => params[:uri], :encoding => "UTF-8"
  end
end
