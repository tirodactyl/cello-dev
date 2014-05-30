class SessionsController < ApplicationController
  before_action :require_logged_out!, only: [:new, :create]
  before_action :require_logged_in!, only: :destroy
  def new
    @user = User.new()
  end
  
  def create
    @user = User.find_by_credentials(session_params[:email], session_params[:password])
    if @user
      login!(@user)
      redirect_to root_url
    else
      flash[:errors] = ['Invalid login information']
      @user = User.new(email: session_params[:email])
      render :new
    end
  end
  
  def destroy
    logout!
    redirect_to root_url
  end
  
  private
  def session_params
    params.require(:user).permit(:email, :password)
  end
end
