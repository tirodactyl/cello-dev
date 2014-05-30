class UsersController < ApplicationController
  before_action :require_logged_out!, only: [:new, :create]
  before_action :require_logged_in!, only: [:show, :index]
  
  def new
    @user = User.new()
  end
  
  def create
    @user = User.new(user_params)
    
    if @user.save!
      login!(@user)
      redirect_to root_url
    else
      flash[:errors] = @user.errors.full_messages
      render :new
    end
  end
  
  def show
    @user = User.find(params[:id])
  end
  
  def index
    @users = User.all
  end
  
  private
  def user_params
    params.require(:user).permit(:email, :password)
  end

end
