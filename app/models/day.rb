class Day
  include Mongoid::Document
  field :title,  type: String
  field :day_id, type: Integer

  embedded_in :plan
end
