# Here we will define our channel to inherit from the ApplicationCable::Channel class that we described earlier on.
class TasksChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users_#{params[:id]}"
  end
end

# Our Messages Channel needs only one method for our purposes, the #subscribed method. This method is responsible for subscribing to and streaming messages that are broadcast to this channel.
