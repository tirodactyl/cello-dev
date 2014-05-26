class IterationsController < ApplicationController
  def create
    @iteration = Iteration.new(iteration_params)
    
    if @iteration.save
      render partial: "api/iterations/iteration", locals: { iteration: @iteration }
    else
      render json: { errors: @iteration.errors.full_messages }, status: 422
    end
  end
  
  def update
    @iteration = Iteration.find(params[:id])
    
    if @iteration.update_attributes(iteration_params)
      render partial: "api/iterations/iteration", locals: { iteration: @iteration }
    else
      render json: { errors: @iteration.errors.full_messages }, status: 422
    end
  end
  
  def show
    @iteration = Iteration.find(params[:id])
    render partial: "api/iterations/iteration", locals: { iteration: @iteration }
  end
  
  def index
    @iterations = Project.find(params[:project_id]).iterations
    
    render :index
  end
  
  private
  def iteration_params
    params.require(:iteration).permit(:project_id, :velocity, :start_date, :end_date)
  end
end
