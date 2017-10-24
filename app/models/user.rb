class User < ApplicationRecord
  # allows for User.first.owned_tasks (get tasks) - allows for User.first.owned_tasks.first.minute - User.first.owned_tasks.first.minute.title
  has_many :owned_tasks, :class_name => "Task", :foreign_key => "owner_id", dependent: :destroy
  has_many :assigned_tasks, :class_name => "Task", :foreign_key => "assignee_id", dependent: :destroy
  has_many :created_tasks, :class_name => "Task", :foreign_key => "creator_id", dependent: :destroy

  # included in (attendees) - User.first.created_tasks.first.minute.attendees
  # User.second.created_tasks.first.minute.attendees.first.user
  has_many :attendees
  has_many :minutes, :through => :attendees, source: :minute

  # minute that they created - allows User.first.created_minutes - User.first.created_minutes.first.title
  has_many :created_minutes, :class_name => "Minute", :foreign_key => "minute_creator_id", dependent: :destroy

  # Include default devise modules. Others available are:
  # :confirmable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
  :lockable
end
