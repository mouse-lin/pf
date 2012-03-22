# -*- encoding : utf-8 -*-
require File.dirname(__FILE__) + '/spec_helper'

describe "Provider" do

  before(:each) do
    @build_param = {"name" => 'zhen', "email" => "zhenWusw@gmail.com"}
    @pastry = Pastry.create(@build_param)
    @fields = ["name", "email"]
  end

  describe "given a regual Pastry mdoel" do

    it "should invoke provide_action with params @required_fields and false" do
      @pastry.expects(:provide_action).with(@fields, false)
      @pastry.provide(@fields)
    end

    it "should invoke provide_action with params @required_fields and true" do
      @pastry.expects(:provide_action).with(@fields, true)
      @pastry.provide!(@fields)
    end
  end

  describe "test provide_action" do

    it "should assign unkonwn attribute to nil" do
      extra_fields = @fields.push("extra")
      @pastry.provide_action(@fields, false).should == @build_param.update("extra" => nil)
    end

    it "should raise RuntimeError when assign unkonwn attribute" do
      expect {
        @pastry.provide_action(@fields.push("extra"), true)
      }.to raise_error(RuntimeError)
    end
  end

end
