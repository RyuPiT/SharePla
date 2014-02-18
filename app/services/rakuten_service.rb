class RakutenService
  API_ENDPOINT = 'http://api.rakuten.co.jp/rws/3.0/json'

  def self.hotel_search(keyword)
    httpClient = HTTPClient.new
    begin
      json_data = JSON.parse httpClient.get_content( RakutenService::API_ENDPOINT, hotel_search_params(keyword) )
      type      = 'Hotel'
      formated_data         = { meta: { search_word: keyword, type: type } }
      formated_data[:cards] = extract_cards json_data
      return formated_data
    rescue HTTPClient::BadResponseError => e
    rescue HTTPClient::TimeoutError => e
    end
    nil
  end

  def self.hotel_search_params(keyword)
    raw_data = common_params.merge( 'operation' => 'KeywordHotelSearch', 'keyword' => keyword, 'datumType' => 1 )
  end

  def self.common_params
    {
      'developerId' => ENV['RakutenDeveloperId'],
      'affiliateId' => ENV['RakutenAffiliateId'],
      'version'     => '2009-10-20'
    }
  end

  private

  def self.extract_cards raw_data
    hotel_info = 'hotelBasicInfo'
    raw_data['Body']['KeywordHotelSearch']['hotel'].map { |data|
      {
        main: {
          name:      data[hotel_info]['hotelName'],
          latitude:  data[hotel_info]['latitude'],
          longitude: data[hotel_info]['longitude']
        },
        sub: {
          number:    data[hotel_info]['hotelNo'],
          image_url: data[hotel_info]['hotelImageUrl'],
          info_url:  data[hotel_info]['hotelInformationUrl'],
          name:      data[hotel_info]['hotelName'],
          plan_url:  data[hotel_info]['planListUrl'],
          charge:    data[hotel_info]['hotelMinCharge'],
          address1:  data[hotel_info]['address1'],
          address2:  data[hotel_info]['address2']
        }
      }
    }
  end
end
