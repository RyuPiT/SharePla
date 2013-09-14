class NewplanController < ApplicationController
  def index
  end

  def add
    @planlist = params['keyword']
    render 'newplan/index'
  end
end
