class OpinionsController < ApplicationController
  def index
    @new_opinion = Opinion.new
    @opinions    = Opinion.all
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

  private

  def opinion_params
    params.require(:opinion).permit(:comment, :title)
  end

  def set_plan
    @opinion = Opinion.find(params[:id])
  end
end
