class GoogleService
  @client = GooglePlaces::Client.new(ENV['GooglePlacesApiKey'])

  def self.touring_search(keyword)
    keyword += ' 観光地'
    @raw_data = @client.spots_by_query(keyword, input: 'Japan', langrage: 'ja')
    format_data
  end

  private

  def self.format_data
    formatted_data = []
    @raw_data.each do |data|
      hash_data = {
        name:      data.name,
        latitude:  data.lat,
        longitude: data.lng
      }
      formatted_data.push(hash_data);
    end
    formatted_data
  end
end
