# -*- coding: utf-8 -*-
class PlansController < ApplicationController
  before_action :set_plan, only: :clone
  before_action :set_area, only: [:index, :clone]

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

  def clone
    render template: "plan/index"
  end

  private

  def plan_params
    {
      'title'       => params['plan']['title'],
      'description' => params['plan']['desc'],
      'area_tags'   => params['plan']['area_tags']
    }
  end

  def set_plan
    @plan = Plan.find(params['id'])
  end

  def set_area
    hokkaido = ["北海道"]
    tohoku   = ["青森県","岩手県","宮城県","秋田県","山形県","福島県"]
    kanto    = ["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"]
    chubu    = ["新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
      "静岡県","愛知県"]
    kinki    = ["三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"]
    chugoku  = ["鳥取県","島根県","岡山県","広島県","山口県"]
    shikoku  = ["徳島県","香川県","愛媛県","高知県"]
    kyushu   = ["福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県"]
    okinawa  = ["沖縄県"]

    @all_area = { 北海道: hokkaido, 東北: tohoku, 関東: kanto,
      中部: chubu, 近畿: kinki, 中国: chugoku, 四国: shikoku,
      九州: kyushu, 沖縄: okinawa }
  end
end
