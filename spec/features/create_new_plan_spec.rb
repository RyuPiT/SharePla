require 'spec_helper'

feature 'ユーザーは新しくプランを作成し保存出来る', js: true  do
  given(:title) { '沖縄一人旅' }
  scenario 'トップページを訪れおもむろに、沖縄一人旅プランを作成する。作成すると、トップページに沖縄一人旅が表示される。' do
    visit plans_path
    expect(current_path).to eq plans_path

    click_on '新しいプランを作成する'
    expect(current_path).to eq new_plan_path

    fill_in '一言コメント', with: '肉屋'
    click_on '追加'

    fill_in 'プランタイトル', with: title
    click_on 'プラン保存'

    expect(page).to have_text title
  end
end
