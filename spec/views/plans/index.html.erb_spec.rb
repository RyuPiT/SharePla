require 'spec_helper'
describe 'plans/index.html.haml' do
  describe  do
    before do
      render
    end

    it 'has link' do
      expect(response).to have_selector('a','/plans/new')
    end

  end
end
