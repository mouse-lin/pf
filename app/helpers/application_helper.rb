module ApplicationHelper
  def blank(n)
    result = ""
    n.times { result += '&nbsp;' }
    result.html_safe
  end
end
