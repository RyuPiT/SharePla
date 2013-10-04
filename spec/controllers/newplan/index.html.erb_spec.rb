# -*- coding: utf-8 -*-
require 'spec_helper'
describe 'newplan/index.html.erb' do
  describe "example" do
    it "check routable" do
      expect(:get => "/profiles").not_to be_routable
    end
  end
  
  describe NewplanController do
    before do
      get :index
    end
    
    it "success" do
      response.should be_success
    end
    
    it "viewable" do
      response.should render_template("index")
    end
  end

  describe NewplanController do
    before do
      @params ={
        :keyword => "新宿プリンスホテル"
      }
    end
    
    it "success" do
      post :add, @params
      expect(response).to be_success
      expect(assigns[:planlist]) == @params['keyward']
    end
  end
end
