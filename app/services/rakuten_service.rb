class RakutenService
  API_ENDPOINT = 'http://api.rakuten.co.jp/rws/3.0/json'

  def self.hotel_search(keyword)
    httpClient = HTTPClient.new
    begin
      return JSON.parse httpClient.get_content(RakutenService::API_ENDPOINT, hotel_search_params(keyword))
    rescue HTTPClient::BadResponseError => e
    rescue HTTPClient::TimeoutError => e
    end
    nil
  end

  def self.hotel_search_params(keyword)
    common_params.merge('operation' => 'KeywordHotelSearch', 'keyword' => keyword)
  end

  def self.common_params
    {
      'developerId'   => ENV['RakutenDeveloperId'],
      'affiliateId'   => ENV['RakutenAffiliateId'],
      'version'       => '2009-10-20'
    }
  end
end
