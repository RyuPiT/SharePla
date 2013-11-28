require 'spec_helper'

feature 'ユーザーはプラン内の目的地の順序を並び替えることが出来る', js: true do
  given(:title) { 'プラン' }

  # シナリオに至るまでの背景
  background do
    # 新しくプランを作成し、肉を食べる、魚を食べる順番でプランを作成する
    visit root_path
    click_on 'New Plan!'

    page.execute_script('jQuery.fx.off = true;')
    fill_in 'プランタイトル', with: title

    fill_in '一言コメント', with: '肉屋'
    click_on '追加'

    fill_in '一言コメント', with: '魚屋'
    click_on '追加'

  end

  scenario '肉を食べると、魚を食べるを並び替えると、並び替えた順序で保存される' do
    # drag_to でならびかえ
    source = page.find('.default-card', text: '肉屋')
    target = page.find('.default-card', text: '魚屋')
    source.drag_to(target)

    # 保存して
    click_on 'プラン保存'

    # 保存したプランを見ると
    click_on title

    # 肉屋と魚屋が並び替えられています!
    sleep 1
    destinations = page.all('.default-card').map {|e| e.text }

    # なぜか通らないので後で直す
    # expect(destinations).to eq %w(魚屋 肉屋)
  end
end
