class OpinionsController < ApplicationController
  def index
    @opinions    = Opinion.all
    @new_opinion = Opinion.new
  end

  def create
    @opinion = Opinion.new(opinion_params)

    respond_to do |format|
      if @opinion.save
        flash[:notice] = "投稿しました"
        format.html { render nothing: true }
        format.json { render nothing: true }
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
