class SubmissionsController < ApplicationController
  def create
    submission = Submission.new
    submission.audio = params[:audio_blob]
    submission.save!

    response = RestClient.post('https://audio-app-mf-ct.herokuapp.com/analyze', filename: params[:audio_filename])
    render json: response
  end
end
