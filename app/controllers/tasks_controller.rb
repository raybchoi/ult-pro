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

  def update
    if user_check
      @task = Task.find_by_id(params[:id])
      if @task.update(task_params)
        respond_to do |format|  ## Add this
          format.json { render json: @task, status: :ok}
        end                    ## Add this
      else
        respond_to do |format|  ## Add this
          format.json { render json: @task.errors, status: :unprocessable_entity }
        end
      end
    else
    flash[:error] = "Cannot Update Status"
    end
  end
  private

  def task_params
    params.require(:task).permit(:title, :description, :assignee_id, :owner_id, :due_date, :meeting_id, :status, :completed_date)
  end

  def update_task
    params.require(:task).permit(:status)
  end
  def user_check
    @task = Task.find_by_id(params[:id])
    if current_user.id.to_s == @task.assignee_id.to_s || current_user.id.to_s == @task.owner.id.to_s
      true
    else
      false
    end
  end

end
