module Api
  class StoriesController < ApiController
    def create
      @story = Story.new(story_params)
      @story.requester_id = current_user.id
    
      if @story.save
        render partial: 'api/stories/story', locals: { story: @story }
      else
        render json: { errors: @story.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @story = Story.find(params[:id])
  
      if params[:story_action]
        #here we will send the action with any options once we have a state machine implemented....
      end
      
      if @story.update_attributes(story_params)
        render partial: 'api/stories/story', locals: { story: @story }
      else
        render json: { errors: @story.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      @story = Story.find(params[:id])
    
      render partial: 'api/stories/story', locals: { story: @story }
    end

    def index
      @stories = Project.find(params[:project_id]).stories
      render "index"
    end

    def destroy
      @story = Story.find(params[:id])
    
      if @story.requester_id == current_user.id
        @story.destroy
        render partial: 'api/stories/story', locals: { story: @story }
      else
        render json: { errors: ["Unable to destroy story: #{@story.id}"] }, status: :unprocessable_entity
      end
    end
  
    private
    def story_params
      params.require(:story).permit(:id, :title, :description, :story_type,
            :story_state, :story_points, :project_id, :requester_id, :owner_id)
    end
    def action_params
      params.require(:story_action).permit(:action, :options)
    end
  end
end