class GoogleService
  @add_words = {Touring: ' 観光', Map: ''}
  @client = GooglePlaces::Client.new(ENV['GooglePlacesApiKey'])

  # places API
  def self.place_search(keyword, type)
    raw_data = @client.spots_by_query(keyword + @add_words[type.to_sym], input: 'Japan', language: 'ja')
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
