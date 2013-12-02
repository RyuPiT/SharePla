class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :provider,    type: String
  field :uid,         type: String
  field :screen_name, type: String
  field :name,        type: String
end
