class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true, with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!, only: [:index, :show, :edit, :update]
  before_action :set_user, only: [:index, :show, :edit, :update]

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :company, :delete_flag])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :company, :delete_flag])
  end

  def after_sign_in_path_for(resource_or_scope)
   user_path(resource_or_scope)
  end

  def set_user
    cookies[:id] = current_user.id || ''
  end

end
