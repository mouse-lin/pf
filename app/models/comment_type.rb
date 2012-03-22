class CommentType < ActiveRecord::Base
  has_many :comments

  def self.tree_nodes
    all.inject([]) { |nodes, record| nodes << { :text => record.name, :id => record.id, :leaf => true } }
  end
  
end
