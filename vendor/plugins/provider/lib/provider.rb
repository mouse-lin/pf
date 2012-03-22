# -*- encoding : utf-8 -*-
# Provider
# access attribution and association easily
#
# Demo:
#   #provide attribution
#   SampleOrder.first.provide("number")
#   #=> { "number" => "LSP11-0001" }
#
#   #provide association:
#   SampleOrder.last.provide(["number", "customer/number"])
#   #=> { "number" => "LSP11-0002", "customer/number" => "LuluLemon" }
#
# Note:
#   only "provide!" will raise exception when the attribution or association can't be provided.
#   for example:
#   SampleOrder.first.provide("abcdefghijk")  #=> { "abcdefghijk" => nil }
#   SampleOrder.first.provide!("abcdefghijk") #=> this case will raise exception!
#

module Provider
  def provide(params)
    provide_action(params, false, false)
  end

  def provide!(params)
    provide_action(params, true, false)
  end

  def provide_value!(params)
    provide_action(params,true,true)
  end

  def provide_value(params)
    provide_action(params,false,true)
  end

  private

  def provide_action(params,raise_exception,only_value)
    only_value = only_value
    attrs = (params.is_a? Array) ? params : params.to_a
    r = only_value ? [] : {} 
    attrs.each do |attr|
      begin
        value = eval("self.#{ attr.gsub('/', '.') }")
        if only_value
          value.to_s
          r.push(value)
        else
          r.update(attr => value )
        end
      rescue NoMethodError
        error_msg = "\033[31m [can't provide] #{self.class.name}#ID='#{id}' can't provide '#{attr}' \033[0m"
        if raise_exception
          raise(error_msg)
        else
          only_value ? r.push(" ") : r.update(attr => nil)
        end
      end
    end
    r
  end
end

ActiveRecord::Base.send(:include, Provider)
