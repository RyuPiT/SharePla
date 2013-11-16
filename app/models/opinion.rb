class Opinion
  include Mongoid::Document
  include Mongoid::Timestamps

  field :comment, type: String
  field :title,   type: String
  field :likes,   type: Integer, default: 0

  validates :comment, presence: true
end
