Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['TwitterConsumerSecret'], ENV['TwitterConsumerKey']
end
