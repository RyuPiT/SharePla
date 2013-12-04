class PlansController < ApplicationController
  before_action :set_plan, only: :show

  def index
    @plans = Plan.all
    add_user_info

    @my_plans = extract_my_plans
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

  private

  def plan_params
    params.require(:plan).permit(:title, :description, area_tags: [])
  end

  def set_plan
    @plan = Plan.find(params[:id])
  end

  def add_user_info
    # users_info[Twitter0000][:image_url]等でimageが引っ張ってこれる
    users_info = Hash[User.all.map{ |user| [user[:provider] + user[:uid], {image_url: user[:image_url], screen_name: user[:screen_name]}]}]

    @plans.map! { |plan|
      key = plan[:provider].to_s + plan[:uid].to_s
      image_url   = (users_info[key]==nil)? 'http://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png' : users_info[key][:image_url]
      screen_name = (users_info[key]==nil)? '名無しさん' : users_info[key][:screen_name]
      plan.update_attribute(:image_url, image_url)
      plan.update_attribute(:screen_name, screen_name)
      plan
    }
  end

  def extract_my_plans
    my_key = session[:provider].to_s + session[:user_id].to_s
    my_plans = []
    @plans.each do |plan|
      plan_key = plan[:provider].to_s + plan[:uid].to_s
      next if plan_key == ''
      my_plans.push(plan) if my_key == plan_key
    end
    my_plans
  end
end
