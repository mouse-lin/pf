# -*- encoding : utf-8 -*-
class MasterController < ApplicationController
  def index
  end

  def import
    respond_to do |format|
      format.html do
        begin
          @import = ImportMaster.create(params[:master])
          MasterImporter.create(params[:model_name], @import.attachment.url.split("?")[0])
          @import.destroy
          render :text => true
        rescue => e
          @import.destroy
          render :json => { :error_msg => e.message, :success => false }, :content_type => 'text/html'
        end
      end
    end
  end
end
