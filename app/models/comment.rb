class Comment
  include Mongoid::Document
  include Mongoid::Timestamps

  field :text,     type: String
  field :provider, type: String
  field :uid,      type: String

  embedded_in :plan

  validates :text, presence: true
end
