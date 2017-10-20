class Attendee < ApplicationRecord
  # this is singular b/c each minute user only belongs to a single user - this is the attendees table
  belongs_to :minute
  belongs_to :user
end
