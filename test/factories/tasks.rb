FactoryBot.define do
  factory :task do
    name { generate :string }
    description { generate :string }
    author factory: :manager
    assignee factory: :developer
    expired_at { Date.current.tomorrow }
  end
end

