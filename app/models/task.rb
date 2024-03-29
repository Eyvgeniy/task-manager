class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine initial: :new_task do
    event :to_dev do
      transition from: [:new_task, :in_qa, :in_code_review], to: :in_development
    end
    event :to_archive do
      transition from: [:new_task, :released], to: :archive
    end
    event :testing do
      transition in_development: :in_qa
    end
    event :to_review do
      transition in_qa: :in_code_review
    end
    event :to_code_release do
      transition in_code_review: :ready_for_release
    end
    event :to_released do
      transition ready_for_release: :released
    end
  end
end
