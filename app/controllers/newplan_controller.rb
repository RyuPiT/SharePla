class NewplanController < ApplicationController
  def index
  end

  def add
    word = { name: params['name'] }

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: word }
    end
  end

  def search_hotel
    @json_data = RakutenService.hotel_search(params['name'])

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: @json_data }
    end
  end

  def save
    arr = []

    @plan = Plan.new(plan_params)

    params['plan']['days'].each do |key,value|
      @plan.days.push(Day.new(value))
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
    {
      'title'       => params['plan']['title'],
      'description' => params['plan']['desc']
    }
  end
end
