class GoogleService
  @client = GooglePlaces::Client.new(ENV['GooglePlacesApiKey'])

  def self.places_search(keyword)
    raw_data = @client.spots_by_query(keyword, input: 'Japan', language: 'ja')
    formated_data         = {meta: 'Touring'}
    formated_data[:cards] = extract_cards raw_data
  end

  private

  def self.extract_cards raw_data
    raw_data.map { |data|
      {
        main: {
          name:      data.name,
          latitude:  data.lat,
          longitude: data.lng
        }
      }
    }
  end
end
