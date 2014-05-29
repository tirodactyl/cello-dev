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
      @project = Project.includes(:iterations, :stories).find(params[:id])
    
      if !@project.current_iteration_id || @project.current_iteration.end_date < Time.now

        new_iteration = @project.iterations.create
        
        if @project.current_iteration
          incomplete_stories = @project.current_iteration.stories
                .where('story_state != ?', 'accepted')
          incomplete_stories.each do |story|
            story.iteration_id = new_iteration.id
            story.save!
          end
        end
        
        @project.current_iteration_id = new_iteration.id
        
        @project.save
      end
    
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