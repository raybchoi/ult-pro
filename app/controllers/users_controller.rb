class UsersController < ApplicationController
  before_action :user_check
  before_action :find_user, only: [:edit, :show, :update]

  def index
    @users = User.where(company: current_user.company)
  end

  def show
    if user_check
      @user
    else
      flash[:notice] = "Sorry! Looks likes you went to the wrong place :("
      redirect_back(fallback_location: root_path)
    end
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
    @user = User.find(params[:id])
  end

  def user_check
    @user = User.find_by_id(params[:id])
    if current_user.id == @user.id
      true
    else
      false
    end
  end

end
