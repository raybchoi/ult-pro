class TasksController < ApplicationController
  def show
    # need some current user checks in here
    @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    respond_to do |format|
      if @task.save
        # format.html { render :partial => 'users/tasks' }
        format.json { render :show, status: :created, location: @task }
        # @user = User.find(params[:id])
        # format.json { render json: @user, status: :created, location: @task }
        flash[:msg] = "Your task was saved!"
      else
        format.json { render json: @task.errors, status: :unprocessable_entity }
        flash[:error] = "Your pet was not saved!"
      end
    end
  end


  private

  def task_params
    params.require(:task).permit(:title, :description, :assignee_id, :owner_id, :creator_id, :due_date, :assigned_date, :meeting_id, :status)
  end


end
