require 'spec_helper'

describe Card do
  #pending "add some examples to (or delete) #{__FILE__}"
  it "is valid with all field" do
    day = Card.new(
      title: "title test",
      day_id: 1
    )
    expect(day).to be_valid
  end
end
