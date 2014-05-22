Tracker::Application.routes.draw do
  root to: "site#root"
  resources :users, only: [:new, :create, :show, :index]
  resource :session, only: [:new, :create, :destroy]
  
  namespace :api, defaults: {format: :json} do
    resources :projects
  end
end
