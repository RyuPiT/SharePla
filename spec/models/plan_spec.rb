require 'spec_helper'

describe Plan do
  #pending "add some examples to (or delete) #{__FILE__}"
  it "is valid with all field" do
    plan = Plan.new(
      area_tags: ["okinawa"],
      days: [ Day.new(title: "test") ],
      description: "desc test",
      sumbnail: "sumbnail test",
      tags: ["a","b"],
      title: "title test"
    )
    expect(plan).to be_valid
  end

  it "is invalid without a title" do
    expect(Plan.new(title: nil)).to have(1).errors_on(:title)
  end
end
