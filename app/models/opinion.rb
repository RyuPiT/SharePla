class Opinion
  include Mongoid::Document
  include Mongoid::Timestamps

  field :comment, type: String

  validates :comment, presence: true
end
