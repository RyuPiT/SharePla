class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :provider,    type: String
  field :uid,         type: String
  field :screen_name, type: String
  field :name,        type: String
  field :image_url,   type: String


  def self.find_by_provider_and_uid(provider,uid)
    where( provider: provider, uid: uid ).first
  end

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider    = auth[:provider]
      user.uid         = auth[:uid]
      user.screen_name = auth[:extra][:raw_info][:screen_name]
      user.name        = auth[:info][:name]
      user.image_url   = auth[:info][:image]
    end
  end
end
