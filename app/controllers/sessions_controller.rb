class SessionsController < ApplicationController
  def callback
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end
end
