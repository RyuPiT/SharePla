class GoogleService
  @client = GooglePlaces::Client.new(ENV['GooglePlacesApiKey'])

  def self.touring_search(keyword)
    keyword += ' 観光地'
    raw_data = @client.spots_by_query(keyword, input: 'Japan', language: 'ja')
    format raw_data
  end

  private

  def self.format raw_data
    raw_data.map { |data|
      {
        name:      data.name,
        latitude:  data.lat,
        longitude: data.lng
      }
    }
  end
end
