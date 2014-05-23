Tracker::Application.routes.draw do
  root to: "site#root"
  resources :users, only: [:new, :create, :show, :index]
  resource :session, only: [:new, :create, :destroy]
  
  namespace :api, defaults: {format: :json} do
    resources :projects, only: [:create, :update, :show, :index, :destroy] do
      resources :stories, only: [:index]
    end
    
    resources :stories, only: [:create, :update, :show, :destroy]
  end
end
