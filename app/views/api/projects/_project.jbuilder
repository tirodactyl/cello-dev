json.extract! project, :id, :title, :description, :owner_id, :created_at, :updated_at
json.stories project.stories, partial: 'api/stories/story, as: :story
json.iterations project.iterations, partial: 'api/iterations/iteration, as: :iteration