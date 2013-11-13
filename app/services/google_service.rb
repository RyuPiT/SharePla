class GoogleService
  @eng2ja = {Touring: '観光'}
  @client = GooglePlaces::Client.new(ENV['GooglePlacesApiKey'])

  def self.places_search(keyword, type)
    ja_type  = @eng2ja[type.to_sym]
    raw_data = @client.spots_by_query(keyword + ' '  + ja_type, input: 'Japan', language: 'ja')
    formated_data         = {meta: {search_word: keyword, type: type}}
    formated_data[:cards] = extract_cards raw_data
    formated_data
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
