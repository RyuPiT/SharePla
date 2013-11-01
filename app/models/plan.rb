class Plan
  include Mongoid::Document
  include Mongoid::Timestamps

  field :area_tags,   type: Array
  field :tags,        type: Array
  field :description, type: String
  field :sumbnail,    type: String
  field :title,       type: String

  embeds_many :days

  validates :title, presence: true
end
