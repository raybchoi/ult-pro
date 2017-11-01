class TasksController < ApplicationController

  def show
    # need some current user checks in here
    if user_check
      @task = Task.find(params[:id])
    else
      flash[:notice] = "Sorry! Looks likes you went to the wrong place :("
      redirect_to user_path(current_user.id)
    end
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    respond_to do |format|
      if @task.save
        format.json { render :show, status: :created, location: @task }
        #broadcasting out to messages channel including the chat_id so messages are broadcasted to specific chat only
        ActionCable.server.broadcast( "users_#{task_params[:assignee_id]}",
        #message and user hold the data we render on the page using javascript
          task: Task.find_by_id(@task[:id]),
          assignee_info: Task.find_by_id(@task[:id]).assignee,
          owner_info: Task.find_by_id(@task[:id]).owner
        )
        # format.html { render :partial => 'users/tasks' }
        # @user = User.find(params[:id])
        # format.json { render json: @user, status: :created, location: @task }
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
          format.json { render :show, status: :ok}
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


  def destroy
    if user_check
      @task = Task.find_by_id(params[:id])
      if @task.update(task_params)
        respond_to do |format|  ## Add this
          format.json { render :show, status: :ok}
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
    params.require(:task).permit(:title, :description, :assignee_id, :owner_id, :due_date, :meeting_id, :status, :completed_date, :delete_flag)
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
