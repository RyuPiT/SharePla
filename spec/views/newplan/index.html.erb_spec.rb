# -*- coding: utf-8 -*-
require 'spec_helper'
describe 'newplan/index.html.erb' do
  describe 'check list' do 
    before do
      assigns[:keyword] = "新宿プリンスホテル"
      render
    end

    it 'has planlist'do
      expect(response).to have_selector('li' ,"新宿プリンスホテル")
    end

  end
end
