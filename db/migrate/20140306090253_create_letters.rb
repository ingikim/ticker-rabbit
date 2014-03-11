class CreateLetters < ActiveRecord::Migration
  def change
    create_table :letters do |t|
      t.string :message
      t.string :tag

      t.timestamps
    end
  end
end
