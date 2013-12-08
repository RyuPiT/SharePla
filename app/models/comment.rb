class Comment
  include Mongoid::Document
  include Mongoid::Timestamps

  field :text,   type: String
  field :writer, type: String

  embedded_in :plan

  validates :text, presence: true
end
