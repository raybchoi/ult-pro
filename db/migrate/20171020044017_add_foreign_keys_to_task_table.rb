class AddForeignKeysToTaskTable < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :tasks, :users, column: :owner_id
    add_foreign_key :tasks, :users, column: :assignee_id
    add_foreign_key :tasks, :users, column: :creator_id
    add_foreign_key :tasks, :minutes, column: :minute_id

    add_foreign_key :minutes, :users, column: :minute_creator_id
  end
end
