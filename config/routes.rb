Tracker::Application.routes.draw do
  root to: "site#root"
  get "/home", to: "site#home", as: "home"
  get "/about", to: "site#about", as: "about"
  resources :users, only: [:new, :create, :show, :index]
  resource :session, only: [:new, :create, :destroy]
  
  namespace :api, defaults: {format: :json} do
    resources :projects, only: [:create, :update, :show, :index, :destroy] do
      resources :stories, only: [:index]
      resources :iterations, only: [:index]
    end
    
    resources :stories, only: [:create, :update, :show, :destroy]
    resources :iterations, only: [:create, :update, :show]
  end
end
