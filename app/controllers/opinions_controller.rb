class OpinionsController < ApplicationController
  before_action :set_opinion, only: :like

  def index
    @new_opinion = Opinion.new
    @opinions    = Opinion.all
    @ids         = session[:ids] if session[:ids].present?
  end

  def create
    @opinion = Opinion.new(opinion_params)

    respond_to do |format|
      if @opinion.save
        flash[:notice] = "投稿しました"
        index # @new_opinionの初期化と@opinionsの再設定
        format.html {
          render action: 'index'
        }
      end
    end
  end

  def like
    json_data = { id: params[:id] }
    likes = @opinion[:likes] + 1

    @opinion.update(likes: likes)
    if session[:ids].nil?
      session[:ids] = [ params[:id] ]
    else
      session[:ids].push(params[:id])
    end

    respond_to do |format|
      format.json { render json: json_data }
    end
  end

  private

  def opinion_params
    params.require(:opinion).permit(:comment, :title)
  end

  def set_opinion
    @opinion = Opinion.find(params[:id])
  end
end
