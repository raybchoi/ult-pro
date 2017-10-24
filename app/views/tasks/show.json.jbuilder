json.extract! @task, :title, :description, :assignee_id, :owner_id, :creator_id, :due_date, :assigned_date, :id, :owner_id

json.url user_url(@task, format: :json)
