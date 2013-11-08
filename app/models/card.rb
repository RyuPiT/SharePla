class Card
  include Mongoid::Document
  field :title,     type: String
  field :day_id,    type: Integer, default: 1
  field :card_type, type: String
  field :latitude,  type: Float
  field :longitude, type: Float

  embedded_in :plan
end
