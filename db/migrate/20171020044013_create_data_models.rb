class CreateDataModels < ActiveRecord::Migration[5.1]
  def change

    create_table :tasks do |t|
      t.string :title
      t.string :description
      t.string :completed
      t.string :delete_flag
      t.date :due_date
      t.date :assigned_date
      t.date :completed_date
      t.integer :owner_id
      t.integer :assignee_id
      t.integer :creator_id
      t.integer :minute_id
      t.timestamps
    end

    create_table :minutes do |t|
      t.string :title
      t.string :notes
      t.string :delete_flag
      t.string :remove_from_view
      t.date :meeting_date
      t.integer :minute_creator_id
      t.timestamps
    end

    create_table :attendees do |t|
      t.belongs_to :user, index: true
      t.belongs_to :minute, index: true
      t.timestamps
    end

  end
end
