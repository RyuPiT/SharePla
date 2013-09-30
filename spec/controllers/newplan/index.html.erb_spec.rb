# -*- coding: utf-8 -*-
require 'spec_helper'
describe 'newplan/index.html.erb' do
  it "does not expose a list of profiles" do
    expect(:get => "/profiles").not_to be_routable
  end
end
