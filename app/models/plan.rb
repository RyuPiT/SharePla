class Plan
  include Mongoid::Document
  include Mongoid::Timestamps

  field :area_tags,   type: Array
  field :tags,        type: Array
  field :description, type: String
  field :thumbnail,   type: String
  field :title,       type: String

  field :provider, type: String
  field :uid,      type: String

  embeds_many :cards

  validates :title, presence: true

  def self.find_my_plan(provider,uid)
    where( provider: provider, uid: uid )
  end
end
