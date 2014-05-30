class SiteController < ApplicationController
  before_action :require_logged_in!, only: [:root]
  
  def root
  end
  
  def home
  end
  
  def about
  end
end
