FactoryBot.define do
  factory :task do
    name
    description
    state { 'new_task' }
    expired_at { Date.current.tomorrow }
    author factory: :manager
    assignee factory: :developer
  end
end
