class CreateScoreTypes < ActiveRecord::Migration
  def self.up
    create_table :score_types do |t|
      t.string :name
      t.integer :begin
      t.integer :end

      t.timestamps
    end
  end

  def self.down
    drop_table :score_types
  end
end
