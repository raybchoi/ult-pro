# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Task.destroy_all
Minute.destroy_all
User.destroy_all
# Minutes_user.destroy_all

User.create([
  {
    first_name: "Ray",
    last_name: "Choi",
    email: "r@r.com",
    company: "GAP",
    password: '123456',
  },
  {
    first_name: "Eric",
    last_name: "Choi",
    email: "e@e.com",
    company: "GAP",
    password: '123456',
  },
  {
    first_name: "Mo",
    last_name: "Choi",
    email: "m@m.com",
    company: "GAP",
    password: '123456',
  },
])

Minute.create([
  {
    title: "RFID KickOff",
    notes: "We kicked off the RFID!! YES!",
    meeting_date: "10-07-2017",
    minute_creator: User.first,
  },
  {
    title: "Rails React Finalization",
    notes: "React on Rails is a thing.... how crazy?",
    meeting_date: "10-27-2017",
    minute_creator: User.first,
  },
  {
    title: "Job Hunt",
    notes: "Weekly meeting with Andy about jobs went well",
    meeting_date: "10-20-2017",
    minute_creator: User.third,
  },
])

Task.create([
  {
    title:"Fin Models are awesome",
    description: 'Complete finanical model Financial modeling is the task of building an abstract representation (a model) of a real world financial situation. This is a mathematical model designed to represent (a simplified version of) the performance of a financial asset or portfolio of a business, project, or any other investment.',
    assignee: User.first,
    owner: User.third,
    creator: User.second,
    minute: Minute.first,
    due_date: "10-20-2017",
    assigned_date: "10-12-2017",
    status: "Inprogress",
  },
  {
    title:"RoR for the win?",
    description: `Complete Rails / React App In your Rails app, generate a scaffold for a conference resource that includes the conference's name (a string) and location (also a string, for now). Carefully read the output in the Terminal. Scaffolding generates a lot of files when we have a full Rails app, but the number is more managable when you're just building an API.`,
    assignee: User.second,
    owner: User.third,
    creator: User.third,
    minute: Minute.second,
    due_date: "10-21-2017",
    assigned_date: "10-10-2017",
    status: "Blocked",
  },
  {
    title:"Job no...",
    description: 'Finish job resume today, tomorrow I dont relaly know but I do know that I need to finish my resume so I can figure out what the hell to do',
    assignee: User.third,
    owner: User.first,
    creator: User.first,
    minute: Minute.second,
    due_date: "10-30-2017",
    assigned_date: "10-20-2017",
    status: "Open",
  },
  {
    title:"Team report",
    description: 'The VIA Pro Team Report is for individuals working together in a group. ... In any case, this report is designed to provide managers, team leaders, consultants, and others with a unique perspective on the dynamics of the group as well as a new lens through which to view each member.',
    assignee: User.third,
    owner: User.first,
    creator: User.first,
    minute: Minute.second,
    due_date: "11-20-2017",
    assigned_date: "10-02-2017",
    status: "Blocked",
  },
  {
    title: 'RFID Tagging',
    description: 'DUE TO FIGURE this out: RFID tagging is an ID system that uses small radio frequency identification devices for identification and tracking purposes. An RFID tagging system includes the tag itself, a read/write device, and a host system application for data collection, processing, and transmission.',
    assignee: User.first,
    owner: User.second,
    creator: User.third,
    minute: Minute.first,
    due_date: "10-20-2017",
    status: "Completed",
    completed_date: "10-21-2017",
  },
])

def add_addendees
  Minute.first.users << User.second
  Minute.first.users << User.third
  Minute.second.users << User.third
  Minute.third.users << User.first
  Minute.third.users << User.second
end

add_addendees
