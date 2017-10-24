json.extract! @task, :id, :title, :description, :status, :delete_flag, :due_date, :assigned_date, :completed_date

json.url task_url(@task, format: :json)

json.assignee_info @task.assignee
json.owner_info @task.owner
json.creator_info @task.creator

json.minute_info do
  json.minute_id @task.minute.id
  json.minute_title @task.minute.id
  json.minute_notes @task.minute.notes
  json.delete_flag @task.minute.delete_flag
  json.remove_from_view @task.minute.remove_from_view
  json.meeting_date @task.minute.meeting_date
  json.updated_at @task.minute.updated_at
  json.minute_creator_info @task.minute.minute_creator

  json.minute_attendees @task.minute.users
end
