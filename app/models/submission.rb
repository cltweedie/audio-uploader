class Submission < ApplicationRecord
  mount_uploader :audio, AudioUploader
end
