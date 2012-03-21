namespace :purchasing do
  desc "generate single relation order data"
  task :env => :environment do
    ActiveRecord::Base.transaction do
      begin
        clss = [
          { :name => "高一（2）班" },
          { :name => "高二（7）班" }
        ]
        Classes.destroy_all
        cls = Classes.create(clss)

        ps = [
          {
            :name => "小明",
            :phone => "10086", 
            :home => "广东移不动", 
            :number => "10086110120",
            :sex => "男", 
            :type => "student", 
            :class => Classes.first, 
          },
          { 
            :name => "大明",
            :phone => "10010", 
            :home => "中国电不信", 
            :number => "10010315123", 
            :sex => "女", 
            :type => "student", 
            :class => Classes.last, 
          },
        ]
        sts = Person.create(ps)
        
        cses = [
          { :name => "语文" },
          { :name => "数学" },
          { :name => "英语" }
        ]
        cs = Course.create(cses)

        Person.all.each do |person|
          Course.all.each do |course|
          end
        end
        CourseScore.destroy_all
        css = CourseScore.create()

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

      rescue Exception => e
        puts "--------errors: #{e}---------"
        raise ActiveRecord::Rollback
      end
    end
  end
end
