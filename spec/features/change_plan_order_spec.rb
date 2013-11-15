require 'spec_helper'

feature 'ユーザーはプラン内の目的地の順序を並び替えることが出来る', js: true do
  given(:title) { '肉と魚を食べるプラン' }

  # シナリオに至るまでの背景
  background do
    # 新しくプランを作成し、肉を食べる、魚を食べる順番でプランを作成する
    visit root_path
    click_on 'New Plan!'

    # animation を切る
    page.execute_script('jQuery.fx.off = true;')

    fill_in 'プランタイトル', with: title

    fill_in '目的地', with: '肉屋'
    click_on '追加'

    fill_in '目的地', with: '魚屋'
    click_on '追加'

  end

  scenario '肉を食べると、魚を食べるを並び替えると、並び替えた順序で保存される' do
    # drag_to でならびかえ
    source = page.find('.ui-state-default', text: '肉屋')
    target = page.find('.ui-state-default', text: '魚屋')
    source.drag_to(target)

    # 保存して
    click_on 'プラン保存'

    # 保存したプランを見ると
    click_on title

    # 肉屋と魚屋が並び替えられています!
    destinations = page.all('.ui-state-default').map {|e| e.text }
    expect(destinations).to eq %w(ホーム 魚屋 肉屋)
  end
end
