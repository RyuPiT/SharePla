class Plan
  include Mongoid::Document
  include Mongoid::Timestamps

  field :area_tags,   type: Array
  field :tags,        type: Array
  field :description, type: String
  field :thumbnail,   type: String
  field :title,       type: String

  embeds_many :cards

  validates :title, presence: true
end
