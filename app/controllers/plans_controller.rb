class PlansController < ApplicationController
  before_action :set_plan, only: :show

  def index
    @plans    = Plan.all
    @my_plans = Plan.find_my_plans( session[:provider], session[:user_id] ) if session[:user_id]
    @users    = users_info
  end

  def start
    redirect_to plans_path if session[:user_id]
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
    @plan.provider = session[:provider]
    @plan.uid = session[:user_id]

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

  def add_comment
  end

  private

  def plan_params
    params.require(:plan).permit(:title, :description, area_tags: [])
  end

  def set_plan
    @plan = Plan.find(params[:id])
  end

  def users_info
    hash = Hash.new { |h,k| h[k] = Hash.new(&h.default_proc) }
    User.all.each do |user|
      hash[user[:provider]][user[:uid]] = { image_url: user[:image_url], screen_name: user[:screen_name] }
    end
    hash
  end
end
