class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :provider,    type: String
  field :uid,         type: String
  field :screen_name, type: String
  field :name,        type: String

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider    = auth[:provider]
      user.uid         = auth[:uid]
      user.screen_name = auth[:extra][:raw_info][:screen_name]
      user.name        = auth[:info][:name]
    end
  end
end
