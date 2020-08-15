class SubmissionsController < ApplicationController
  def create
    # submission = Submission.new
    # submission.audio = params[:audio_blob]
    # submission.save!

    response = RestClient.post('http://localhost:5000/analyze', file: params[:audio_blob])
    render json: response
  end
end
