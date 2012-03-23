# -*- encoding : utf-8 -*-
require "roo"

module MasterImporterModule
  def column_type_change model_name, column_name, value
    r = nil
    case model_name.constantize.columns_hash[column_name].type
    when :string  then r = value.to_s.strip
    when :integer then r = value.to_i
    when :float   then r = value.to_f
    end
    r
  end

  def foreign_key xls, row_index, attach_column
    conditions = {}
    model_name = attach_column["model_name"].split("_").collect(&:capitalize).join
    attach_column["columns"].each do |column_name, index|
      conditions[column_name] = column_type_change(model_name, column_name, xls.cell(row_index, index))
    end
    result = model_name.constantize.where(conditions)
    if result.blank?
      error_msg = "主档#{attach_column["model_name"]}不存在\n"
      attach_column["columns"].each do |key, value|
        error_msg += "#{key} = #{xls.cell(row_index, value)} \n"
      end
      raise error_msg
    else
      result.first.id
    end
  end

  def find_excel path
    Excel.new(Rails.root.to_s + "/public" + path)
  end

  def divide xls
  #columns = { "supplier_id" => { "columns" => { "number" => 12, ... }, "model_name" => "company" }, "number" => 1, ... }
  columns = {}
  index = 1

  while(index <= xls.last_column)
    field = xls.cell((xls.first_row + 1), index)
    column = { field => index }
    model_name = ""

    unless field.match(/#\w+/).blank?
      raise "'#'格式内不能存在'$'符号" if(!field.match(/^\$/).blank?)
      tmp, field = field.split('#')
      #{ "columns" => { tmp => index }, "model_name" => "#{field}"}
      if field.match(/\(\w+\)$/).blank?
        model_name = field
      else
        model_name, field = field.scan(/\w+/)
      end
      column = { "#{field}_id" => { "columns" => { tmp => index }, "model_name" => model_name } }
    end

    unless field.match(/^\$\w+/).blank?
      index += 1
      symbol , field = field, field.delete("$")
      if field.match(/\(\w+\)$/).blank?
        model_name = field
      else
        model_name, field = field.scan(/\w+/)
      end
      
      field_columns = {  }
      while xls.cell((xls.first_row + 1), index) != symbol
        raise "格式不匹配" if(index == xls.last_column)
        field_columns[xls.cell((xls.first_row + 1), index)] = index
        index += 1
      end
      column = { "#{field}_id" => { "columns" => field_columns, "model_name" => model_name } }
    end

    columns.merge!(column)
    index += 1
  end

  return columns
  end

  def create model_name, xls_path
    xls = find_excel(xls_path)
    model_columns = divide(xls)

    3.upto(xls.last_row) do |row_index|
      row = {}
      model_columns.each do |column_name, column_index|
        unless column_index.class == Hash
          row[column_name] = xls.cell(row_index, column_index)
        else
          row[column_name] = self.foreign_key(xls, row_index, column_index)
        end
      end
      model_name.split("_").collect(&:capitalize).join.constantize.create(row)
    end
  end
end

class MasterImporter
  extend MasterImporterModule
end
