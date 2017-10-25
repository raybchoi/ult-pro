class Task < ApplicationRecord
  # Allows Task.owner (get owner from the task)
  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id", optional: true
  belongs_to :assignee, :class_name => "User", :foreign_key => "assignee_id", optional: true
  # belongs_to :creator, :class_name => "User", :foreign_key => "creator_id", optional: true

  # Allows Task.minute (get the minute for that task)
  belongs_to :minute, :class_name => "Minute", :foreign_key => "minute_id", optional: true
end
