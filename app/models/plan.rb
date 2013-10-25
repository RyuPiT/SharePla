class Plan
  include Mongoid::Document
  include Mongoid::Timestamps

  field :area_tags, type: Array
  field :description, type: String
  field :sumbnail, type: String
  field :tags, type: Array
  field :title, type: String

  embeds_many :days

  validates :title, presence: true
end
