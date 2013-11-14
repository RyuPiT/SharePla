class PlansController < ApplicationController
  before_action :set_plan, only: :show

  def index
    @plans = Plan.all
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

  def hotels_search
    keyword = params[:name]

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: hotels_data(keyword) }
    end
  end

  def places_search
    keyword     = params[:search_word]
    type        = 'Touring'

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: places_data(keyword, type) }
    end
  end

  def map_search
    keyword    = params[:search_word]
    type       = 'Touring'

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: places_data(keyword, type) }
    end
  end

  def create
    @plan = Plan.new(plan_params)

    params[:plan][:cards].each do |key,value|
      @plan.cards.push(Card.new(value))
    end

    respond_to do |format|
      if @plan.save
        flash[:notice] = "保存しました"
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

  def places_data(keyword, type)
    GoogleService.places_search(keyword, type)
  end

  def hotels_data(keyword)
    RakutenService.hotel_search(keyword)
  end
end
