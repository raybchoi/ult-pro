class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true, with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :email, :company, :delete_flag])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :email, :company, :delete_flag])
  end


  def after_sign_in_path_for(resource_or_scope)
   user_path(resource_or_scope)
  end

end
