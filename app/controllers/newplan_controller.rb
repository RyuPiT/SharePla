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
    json = ApplicationHelper::JsonManager.new("plans.json")
    id = 0
    day_id = "day" + id.to_s

    plan = { day_id => { } }

    params['all_card'].each_with_index do |card, i|
      card_list = { "title" => card }
      plan[day_id].store(i,card_list)
      i += 1
    end

    plan_id = json.get_all.length
    plan.store("id", plan_id)
    plan.store("title", params['title'])

    json.add plan
    json.save

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :nothing => true }
    end
  end
end
