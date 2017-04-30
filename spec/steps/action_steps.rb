step 'トップページを表示する' do
  visit root_path
end

step ':textをクリックする' do |text|
  click_on text
end
