json.extract! @user, :id, :first_name, :last_name, :email, :company, :created_at, :updated_at

json.url user_url(@user, format: :json)


# json.created_tasks do
#   json.array!(@user.created_tasks) do |created_task|
#     json.id created_task.id
#     json.title created_task.title
#     json.description created_task.description
#     json.status created_task.status
#     json.delete_flag created_task.delete_flag
#
#     json.due_date created_task.due_date
#     json.assigned_date created_task.assigned_date
#     json.completed_date created_task.completed_date
#     json.created_date created_task.created_at
#
#     json.last_updated_date created_task.updated_at
#     json.url task_url(created_task.id, created_task, format: :json)
#
#     if created_task.minute
#       json.minute_info do
#         json.minute_id created_task.minute.id
#         json.minute_title created_task.minute.id
#         json.minute_notes created_task.minute.notes
#         json.delete_flag created_task.minute.delete_flag
#         json.remove_from_view created_task.minute.remove_from_view
#         json.meeting_date created_task.minute.meeting_date
#         json.updated_at created_task.minute.updated_at
#         json.minute_creator_info created_task.minute.minute_creator
#
#         json.minute_attendees created_task.minute.users
#       end
#     end
#
#     json.owner_info created_task.owner
#     json.assignee_info created_task.assignee
#     json.creator_info created_task.creator
#
#   end
# end

json.owned_tasks do
  json.array!(@user.owned_tasks) do |owned_task|
    # do not send deleted items
    if owned_task.delete_flag != 'true'

    json.id owned_task.id
    json.title owned_task.title
    json.description owned_task.description
    json.status owned_task.status
    json.delete_flag owned_task.delete_flag

    json.due_date owned_task.due_date
    # json.assigned_date owned_task.assigned_date
    json.completed_date owned_task.completed_date
    json.created_date owned_task.created_at

    json.last_updated_date owned_task.updated_at
    json.url task_url(owned_task.id, owned_task, format: :json)

    if owned_task.minute
      json.minute_info do
        json.minute_id owned_task.minute.id
        json.minute_title owned_task.minute.id
        json.minute_notes owned_task.minute.notes
        json.delete_flag owned_task.minute.delete_flag
        json.remove_from_view owned_task.minute.remove_from_view
        json.meeting_date owned_task.minute.meeting_date
        json.updated_at owned_task.minute.updated_at
        json.minute_creator_info owned_task.minute.minute_creator

        json.minute_attendees owned_task.minute.users

      end
    end

    json.owner_info owned_task.owner
    json.assignee_info owned_task.assignee
    # json.creator_info owned_task.creator
    # end of delete_flag if statement
    end
  end
end


json.assigned_tasks do
  json.array!(@user.assigned_tasks) do |assigned_task|
    # do not send deleted items
    if assigned_task.delete_flag != 'true'

    json.id assigned_task.id
    json.title assigned_task.title
    json.description assigned_task.description
    json.status assigned_task.status
    json.delete_flag assigned_task.delete_flag

    json.due_date assigned_task.due_date
    # json.assigned_date assigned_task.assigned_date
    json.completed_date assigned_task.completed_date
    json.created_date assigned_task.created_at

    json.last_updated_date assigned_task.updated_at
    json.url task_url(assigned_task.id, assigned_task, format: :json)

    if assigned_task.minute
      json.minute_info do
        json.minute_id assigned_task.minute.id
        json.minute_title assigned_task.minute.id
        json.minute_notes assigned_task.minute.notes
        json.delete_flag assigned_task.minute.delete_flag
        json.remove_from_view assigned_task.minute.remove_from_view
        json.meeting_date assigned_task.minute.meeting_date
        json.updated_at assigned_task.minute.updated_at
        json.minute_creator_info assigned_task.minute.minute_creator

        json.minute_attendees assigned_task.minute.users
      end
    end

    json.owner_info assigned_task.owner
    json.assignee_info assigned_task.assignee
    # json.creator_info assigned_task.creator
    # end of the deleteFlag
    end
  end
end
