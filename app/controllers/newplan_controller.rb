class NewplanController < ApplicationController
  def index
  end

  def add
    @planlist = { name: params['name'] }
    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => @planlist }
    end
  end

  def save
    arr = Array.new
    plan_params = Hash.new

    params['plan']['days'].each do |key,value|
      arr.push value
    end
    day0 = { "day0" => arr }

    plan_params.store("days",day0)
    plan_params.store("title", params['plan']['title'])
    @plan = Plan.new(plan_params)

    respond_to do |format|
      if @plan.save
        flash[:notice] = "保存しました"
        format.html { render :nothing => true }
        format.json { render :nothing => true }
      end
    end
  end
end
