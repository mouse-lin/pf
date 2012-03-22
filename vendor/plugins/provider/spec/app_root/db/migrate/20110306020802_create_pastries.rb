# -*- encoding : utf-8 -*-
class CreatePastries < ActiveRecord::Migration
  def self.up
    create_table :pastries do |t|
      t.string :name
      t.string :email
    end
  end

  def self.down
    drop_table :pastries
  end
end
