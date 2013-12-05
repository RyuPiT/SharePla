class PlansController < ApplicationController
  before_action :set_plan, only: :show

  def index
    @plans = Plan.all
  end

  def login
  end

  def new
    @plan = Plan.find(params[:id]) if params[:id]
  end

  def show
    respond_to do |format|
      format.pdf do
        send_data render_to_pdf, filename: "#{@plan.id}.pdf", disposition: 'inline'
      end
      format.html
    end
  end

  def create
    @plan = Plan.new(plan_params)

    params[:plan][:cards].each do |key, value|
      @plan.cards.push(Card.new(value))
    end

    respond_to do |format|
      if @plan.save
        flash[:notice] = '保存しました'
        format.html { render nothing: true }
        format.json { render nothing: true }
      end
    end
  end

  private

  def plan_params
    params.require(:plan).permit(:title, :description, area_tags: [])
  end

  def set_plan
    @plan = Plan.find(params[:id])
  end
end
