FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :avatar, :type] do |n|
    "string#{n}"
  end

  sequence :email do |n|
    "person#{n}@email.com"
  end

end