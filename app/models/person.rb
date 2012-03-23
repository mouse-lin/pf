class Person < ActiveRecord::Base
  has_attached_file :image,   
                    :default_url => "/images/Temp.png",
                    :styles => { :medium => "300x300>",  
                                 :thumb => "100x100>" }  
  belongs_to :classes
end
