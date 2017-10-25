class CreateDataModels < ActiveRecord::Migration[5.1]
  def change

    create_table :tasks do |t|
      t.string :title
      t.string :description
      t.string :status
      t.string :delete_flag
      t.bigint :due_date
      # t.integer :assigned_date
      t.bigint :completed_date
      t.integer :owner_id
      t.integer :assignee_id
      # t.integer :creator_id
      t.integer :minute_id
      t.timestamps
    end

    create_table :minutes do |t|
      t.string :title
      t.string :notes
      t.string :delete_flag
      t.string :remove_from_view
      t.bigint :meeting_date
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
