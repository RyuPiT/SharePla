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
    id = 0
    day_id = "day" + id.to_s

    day_plan = { day_id => { } }

    params['all_card'].each_with_index do |card, i|
      card_list = { "title" => card }
      day_plan[day_id].store(i,card_list)
      i += 1
    end

    json = ApplicationHelper::JsonManager.new("plans.json")
    json.add day_plan
    json.save

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :nothing => true }
    end
  end
end
