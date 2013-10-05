class NewplanController < ApplicationController
  def index
  end

  def add
    @planlist = { name: params['name'] }
    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => @planlist }
    end
  end
end
