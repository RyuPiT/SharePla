class Comment
  include Mongoid::Document
  include Mongoid::Timestamps

  field :text, type: String
  field :title,   type: String
  field :likes,   type: Integer, default: 0
  field :writer,  type: String

  embedded_in :plan

  validates :comment, presence: true
end
