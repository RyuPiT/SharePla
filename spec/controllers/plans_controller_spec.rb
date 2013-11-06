require 'spec_helper'

describe 'newplan/index.html.erb' do
  describe PlansController do
    before do
      get :index
    end

    it "check index method" do
      expect(response).to be_success
    end
  end

  describe PlansController do
    before do
      @plan = {
        "name" => "新宿プリンスホテル"
      }
      post :add,@plan
    end

    it "success" do
      expect(response).to be_success
    end

    it "check argments" do
      expect(assigns[:planlist]) == "新宿プリンスホテル"
    end
  end

  describe PlansController do
    before do
      @plan = {
        "name" => nil
      }
      post :add,@plan
    end

    it "success" do
      expect(assigns[:planlist]) == nil
    end

  end
end
