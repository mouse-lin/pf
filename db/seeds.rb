# -*- encoding : utf-8 -*-
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
clss = [
  { :name => "高一（2）班" },
  { :name => "高二（7）班" }
]
Classes.destroy_all
cls = Classes.create(clss)
puts "===Classes==="

ps = [
  {
    :name => "小明",
    :phone => "10086", 
    :home => "广东移不动", 
    :number => "10086110120",
    :sex => "男", 
    :type => "student", 
    :classes => Classes.all.first, 
  },
  { 
    :name => "啊信",
    :phone => "10010", 
    :home => "中国电不信", 
    :number => "10010315123", 
    :sex => "女",
    :type => "student", 
    :classes => Classes.all.first, 
  },
  {
    :name => "大明",
    :phone => "10086", 
    :home => "广东移不动", 
    :number => "10086110911",
    :sex => "男", 
    :type => "student", 
    :classes => Classes.all.last, 
  },
  { 
    :name => "啊电",
    :phone => "10010", 
    :home => "中国电不信", 
    :number => "10010315892", 
    :sex => "女",
    :type => "student", 
    :classes => Classes.all.last, 
  }
]
sts = Person.create(ps)
puts "====Person===="

cses = [
  { :name => "语文" },
  { :name => "数学" },
  { :name => "英语" }
]
cs = Course.create(cses)
puts "====Course==="

CourseScore.destroy_all
Person.all.each do |person|
  Course.all.each do |course|
    CourseScore.create(:course => course, :person => person, :score => rand(100) )
  end
end

ScoreType.destroy_all
ScoreType.create([
  { :name => "优", :begin => 90, :end => 100 },
  { :name => "良", :begin => 80, :end =>89 },
  { :name => "中", :begin => 60, :end =>79 },
  { :name => "差", :begin => 0, :end =>59 },
])

cmses = [
  { :content => "好评" },
  { :content => "差评" },
  { :content => "中评" },
  { :content => "A" },
  { :content => "B" },
  { :content => "C" },
]
Comment.destroy_all
cms = Comment.create(cmses)
cmtses = [
  { :type => "思想德语" },
  { :type => "学风" },
]
CommentType.destroy_all
cmts = CommentType.create(cmtses)
CommentType.first.comments << Comment.limit(3).order("id ASC")
CommentType.last.comments << Comment.limit(3).order("id DESC")
