class NewplanController < ApplicationController
  def index
  end

  def add
    @json_data = RakutenService.hotel_search(params['name'])

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => @json_data }
    end
  end

  def save
    arr = Array.new
    plan_params = Hash.new

    plan_params.store("title",params['plan']['title'])
    plan_params.store("description",params['plan']['desc'])
    @plan = Plan.new(plan_params)

    params['plan']['days'].each do |key,value|
      @plan.days.push(Day.new(value))
    end

    respond_to do |format|
      if @plan.save
        flash[:notice] = "保存しました"
        format.html { render :nothing => true }
        format.json { render :nothing => true }
      end
    end
  end
end
