Rails.application.routes.draw do
  devise_for :users, :controllers => {:registrations => "users/registrations"}

  ### chat start
  # Mount the Action Cable server on a sub-URI of our main application.
  # Action Cable will be listening for WebSocket requests on ws://localhost:3000/cable. It will do so by using the Rack socket hijacking API. When our main application is instantiated, an instance of Action Cable will also be created. Action Cable will, per our instructions in the routes.rb file, establish a WebSocket connection on localhost:3000/cable, and begin listening for socket requests on that URI.
  mount ActionCable.server => '/cable'
  ### chat end


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "users#index"
  resources :users
  resources :tasks
end
