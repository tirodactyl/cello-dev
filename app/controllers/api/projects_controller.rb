module Api
  class ProjectsController < ApiController
    def create
      @project = Project.new(project_params)
      @project.owner_id = current_user.id
    
      if @project.save
        @project.member_ids=[current_user.id]
        render partial: 'api/projects/project', locals: { project: @project }
      else
        render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @project = Project.find(params[:id])
  
      if @project.update_attributes(project_params)
        render partial: 'api/projects/project', locals: { project: @project }
      else
        render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      @project = Project.find(params[:id]).includes(:iterations, :stories)
    
      render partial: 'api/projects/project', locals: { project: @project }
    end

    def index
      @projects = current_user.projects
      render "index"
    end

    def destroy
      @project = Project.find(params[:id])
    
      if @project.owner_id == current_user.id
        @project.destroy
        render partial: 'api/projects/project', locals: { project: @project }
      else
        render json: { errors: ["Unable to destroy project: #{@project.id}"] }, status: :unprocessable_entity
      end
    end
  
    private
    def project_params
      params.require(:project).permit(:title, :description, :owner_id)
    end
  end
end