class TopController < ApplicationController
  before_action :set_plan, only: :show
  def index
    @plans = Plan.all
  end

  def show
  end

  def static
  end

  private
  def set_plan
    @plan = Plan.find(params['id'])
  end
end
