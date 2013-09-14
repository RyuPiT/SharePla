class HelloController < ApplicationController
  def index
    render text: 'Hello World!'
  end

  def to
    @message = "Hello #{params[:name]} !"
  end
end
