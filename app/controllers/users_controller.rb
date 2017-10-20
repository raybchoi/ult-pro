class UsersController < ApplicationController

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
    @created_tasks = @user.created_tasks.all
    @owned_tasks = @user.owned_tasks.all
    @assigned_tasks = @user.assigned_tasks
    @owned_tasks_json = @user.owned_tasks.all.to_json

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

end
