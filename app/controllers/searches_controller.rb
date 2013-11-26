class SearchesController < ApplicationController
  def hotel
    keyword = params[:name]

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: hotels_data(keyword) }
    end
  end

  def place
    keyword     = params[:search_word]
    type        = 'Touring'

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: places_data(keyword, type) }
    end
  end

  def map
    keyword    = params[:search_word]
    type       = 'Map'

    respond_to do |format|
      format.html { render nothing: true }
      format.json { render json: places_data(keyword, type) }
    end
  end

  private

  def places_data(keyword, type)
    GoogleService.place_search(keyword, type)
  end

  def hotels_data(keyword)
    RakutenService.hotel_search(keyword)
  end
end
