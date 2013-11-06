require 'spec_helper'

feature 'ユーザーは新しくプランを作成し保存出来る', js: true  do
  given(:title) { '沖縄一人旅' }
  scenario 'トップページを訪れおもむろに、沖縄一人旅プランを作成する。作成すると、トップページに沖縄一人旅が表示される。' do
    visit root_path
    expect(current_path).to eq root_path

    click_on 'New Plan!'
    expect(current_path).to eq new_plan_path

    fill_in 'プランタイトル', with: title
    click_on 'プラン保存'

    expect(page).to have_text title
  end
end
