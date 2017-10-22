json.extract! @user, :id, :first_name, :last_name, :email, :username, :company, :created_at, :updated_at

json.url user_url(@user, format: :json)

json.created_tasks do
  json.array!(@user.created_tasks) do |created_task|
    json.id created_task.id
    json.title created_task.title
    json.description created_task.description
    json.due_date created_task.due_date
    json.assigned_date created_task.assigned_date
    json.completed_date created_task.completed_date
    json.minute_id created_task.minute
      # json.min_user do
      #     json.min_user created_task.minute.minute_creator
      # end
    json.owner_id created_task.owner
    json.assignee_id created_task.assignee
    json.creator_id created_task.creator
    # route for the path
    json.url user_url(@created_task , created_task, format: :json)
  end
end

json.owned_tasks do
  json.array!(@user.owned_tasks) do |owned_task|
    json.id owned_task.id
    json.title owned_task.title
    json.description owned_task.description
    json.due_date owned_task.due_date
    json.assigned_date owned_task.assigned_date
    json.completed_date owned_task.completed_date
    json.minute_id owned_task.minute
    json.owner_id owned_task.owner
    json.assignee_id owned_task.assignee
    json.creator_id owned_task.creator
    # route for the path
    json.url user_url(@user, owned_task, format: :json)
  end
end


json.assigned_tasks do
  json.array!(@user.assigned_tasks) do |assigned_task|
    json.id assigned_task.id
    json.title assigned_task.title
    json.description assigned_task.description
    json.due_date assigned_task.due_date
    json.assigned_date assigned_task.assigned_date
    json.completed_date assigned_task.completed_date
    json.minute_id assigned_task.minute
    json.owner_id assigned_task.owner
    json.assignee_id assigned_task.assignee
    json.creator_id assigned_task.creator
    # route for the path
    json.url user_url(@user, assigned_task, format: :json)
  end
end
