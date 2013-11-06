# -*- coding: utf-8 -*-
class PlansController < ApplicationController
  before_action :set_plan,     only: :show
  before_action :set_all_area, only: :new

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

  def search_hotel
    @json_data = RakutenService.hotel_search(params[:name])

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: @json_data }
    end
  end

  def create
    @plan = Plan.new(plan_params)

    params[:plan][:days].each do |key,value|
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
      'description' => params['plan']['desc'],
      'area_tags'   => params['plan']['area_tags']
    }
  end

  def set_plan
    @plan = Plan.find(params['id'])
  end

  def set_all_area
    @all_area = {
      北海道: %w[北海道],
      東北:   %w[青森県 岩手県 宮城県 秋田県 山形県 福島県],
      関東:   %w[茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県],
      中部:   %w[新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県],
      近畿:   %w[三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県],
      中国:   %w[鳥取県 島根県 岡山県 広島県 山口県],
      四国:   %w[徳島県 香川県 愛媛県 高知県],
      九州:   %w[福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県],
      沖縄:   %w[沖縄県]
    }
  end
end
