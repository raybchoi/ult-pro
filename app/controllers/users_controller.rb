class UsersController < ApplicationController
  # before_action :user_check, only: [:edit, :show, :update]
  before_action :find_user, only: [:edit, :show, :update]

  def index
    @users = User.where(company: current_user.company)
  end

  def show
    redirect_to user_path(current_user.id) if params[:id] != current_user.id.to_s
    @show_header = true
    @user
  end

  def new
  end

  def create

  end

  def edit
  end

  def update
  end

  def destroy
  end

  def user_check
  end



  private

  def find_user
    @user = current_user
  end

  # def user_check
  #   if current_user.id == User.find_by_id(params[:id]).id
  #     true
  #   else
  #     false
  #   end
  # end

end
