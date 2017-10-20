class Minute < ApplicationRecord
  # allows Minute.first.tasks - gets all the task associated with a minute - allows allows for --> Minute.first.tasks.first.description
  has_many :tasks, :class_name => "Task", :foreign_key => "minute_id", dependent: :destroy

  # all for attendees - User.first.created_minutes.first.attendees or Minute.first.attendees
  has_many :attendees
  has_many :users, :through => :attendees, source: :user

  # user who creates the meeting - allows Minute.first.minute_creator.first_name
  belongs_to :minute_creator, class_name: "User", foreign_key: "minute_creator_id", optional: true

end
