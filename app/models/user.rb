class User < ActiveRecord::Base
  validates :email, :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6 }, on: :create
  before_validations :ensure_session_token!
  
  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end
  
  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  
  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password) if @password
  end
  
  def password_is?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  private
  def ensure_session_token!
    self.session_token ||= self.class.generate_session_token
  end

end
