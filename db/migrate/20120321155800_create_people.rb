class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.string :name
      t.string :phone
      t.string :home
      t.string :number
      t.string :sex
      t.string :type
      t.integer :classes_id
      t.string :comment

      t.string   :image_file_name
      t.string   :image_content_type
      t.integer  :image_file_size
      t.datetime :image_updated_at

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
