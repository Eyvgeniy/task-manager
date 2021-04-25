require "test_helper"

class ManagerTest < ActiveSupport::TestCase
  test "create" do
    admin = create :admin
    assert admin.persisted?
  end
end
