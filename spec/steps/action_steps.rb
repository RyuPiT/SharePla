step 'トップページを表示する' do
  visit root_path
end

step ':textをクリックする' do |text|
  click_on text
end

step ':fieldに:textと入力する' do |field, text|
  fill_in field, with: text
end
