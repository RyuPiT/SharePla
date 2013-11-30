class OpinionsController < ApplicationController
  def index
    @new_opinion = Opinion.new
    @opinions    = Opinion.all
    @ids         = session[:ids] if session[:ids].present?
  end

  def create
    @opinion = Opinion.new(opinion_params)

    respond_to do |format|
      if @opinion.save
        flash.now[:notice] = '投稿しました'
        index # @new_opinionの初期化と@opinionsの再設定
        format.html { render action: 'index' }
      end
    end
  end

  def like
    if session[:ids].present? && session[:ids].include?(params[:id]) then
      is_duplicate = TRUE
      bad_status   = { status: 'bad' }
    else
      set_opinion

      is_duplicate = FALSE
      json_data    = { status: 'ok', id: params[:id] }
      likes        = @opinion[:likes] + 1

      @opinion.update(likes: likes)
      add_id_to_session params[:id]
    end

    respond_to do |format|
      if is_duplicate
        format.json { render json: bad_status }
      else
        format.json { render json: json_data }
      end
    end
  end

  private

  def opinion_params
    params.require(:opinion).permit(:comment, :title)
  end

  def set_opinion
    @opinion = Opinion.find(params[:id])
  end

  def add_id_to_session id
    if session[:ids].nil?
      session[:ids] = [id]
    else
      session[:ids].push(id)
    end
  end
end
