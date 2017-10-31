# json.array!(@users) do |user|
#   json.extract! user, :email
# end


json.array!(@users) do |user|
  # if user.id != current_user.id
    json.extract! user, :id, :first_name, :last_name, :email, :company
    json.url user_url(user, format: :json)
  # end
end
