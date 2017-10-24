# app/views/artists/index.json.jbuilder
json.artists @artists do |artist|
  json.(artist, :id, :name, :label)
  json.albums artist.albums, partial: 'albums/album', as: :album
end

json.extract! @user, :id, :first_name, :last_name, :email, :username, :company, :created_at, :updated_at

json.url user_url(@user, format: :json)

json.created_tasks do
  json.array!(@user.created_tasks) do |created_task|
    json.title created_task.title
    json.description created_task.description
    json.due_date created_task.due_date
    json.assigned_date created_task.assigned_date
    json.completed_date created_task.completed_date
    json.minute_id created_task.minute_id
    json.owner_id created_task.owner_id
    json.assignee_id created_task.assignee_id
    json.creator_id created_task.creator_id
    json.minute_id created_task.minute_id
    # route for the path
    json.url user_url(@user, created_task, format: :json)
  end
end

json.owned_tasks do
  json.array!(@user.owned_tasks) do |owned_task|
    json.title owned_task.title
    json.description owned_task.description
    json.due_date owned_task.due_date
    json.assigned_date owned_task.assigned_date
    json.completed_date owned_task.completed_date
    json.minute_id owned_task.minute_id
    json.owner_id owned_task.owner_id
    json.assignee_id owned_task.assignee_id
    json.creator_id owned_task.creator_id
    json.minute_id owned_task.minute_id
    # route for the path
    json.url user_url(@user, owned_task, format: :json)
  end
end


json.assigned_tasks do
  json.array!(@user.assigned_tasks) do |assigned_task|
    json.title assigned_task.title
    json.description assigned_task.description
    json.due_date assigned_task.due_date
    json.assigned_date assigned_task.assigned_date
    json.completed_date assigned_task.completed_date
    json.minute_id assigned_task.minute_id
    json.owner_id assigned_task.owner_id
    json.assignee_id assigned_task.assignee_id
    json.creator_id assigned_task.creator_id
    json.minute_id assigned_task.minute_id
    # route for the path
    json.url user_url(@user, assigned_task, format: :json)
  end
end
