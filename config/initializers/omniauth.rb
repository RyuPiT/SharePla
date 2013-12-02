Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['TwitterConsumerKey'], ENV['TwitterConsumerSecret']
end
