require 'spec_helper'

describe PlansController do
  before do
    get :index
  end

  it "check index method" do
    expect(response).to be_success
  end
end
