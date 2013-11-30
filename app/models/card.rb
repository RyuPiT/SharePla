class Card
  include Mongoid::Document
  field :title,     type: String
  field :day_id,    type: Integer, default: 1
  field :card_type, type: String
  field :latitude,  type: Float
  field :longitude, type: Float

  embedded_in :plan

  def self.message_samples
    %w[荷物のチェック ここは重要 お土産を購入する この店には絶対に行きたい 超おすすめ 家につくまでが旅行 ここでホラースポットもありかもしれない お目当ての人の心をぐっと掴むチャンス 良いムードになる お酒に注意 アレルギーに注意]
  end
end
