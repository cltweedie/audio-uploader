class SubmissionsController < ApplicationController
  def create
    submission = Submission.new
    submission.audio = params[:audio_blob]
    submission.save!
  end
end
