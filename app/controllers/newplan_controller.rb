class NewplanController < ApplicationController
  def index
  end

  def add
    params['keyword']
    render 'newplan/index'
  end
end
