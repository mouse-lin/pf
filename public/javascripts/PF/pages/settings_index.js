Pf.settings.homeIndex = { 
    panel: function(){ 
        var grid = new Pf.classes.student();
        var studentDetailFormPanel = this.createStuentDetail();
        grid.store.load();
        var panel = new Ext.TabPanel({ 
            autoScroll : true,
            activeTab: 0,
            frame: true,
            items: [
                { title:  "学生主档", 
                    layout: "border",
                    items: [{region: "center",width: 900, items: grid },{ region:"east",width: 500, layout: "anchor", items:studentDetailFormPanel }]   
                },
                { title:  "学生主档", html: "mouse"  },
            ]
        });
        return panel;
    },

    createStuentDetail: function(){ 
        var formPanel = new Ext.form.FormPanel({ 
           title: "test",
           anchor: "100% 100%",
           autoScroll : true,
           frame: true,
           labelAlign : 'right',
           items: [{ 
              layout: 'column',
              items:[
              { 
                  width : 150,
                  layout: 'fit',
                  items: [new Ext.form.FieldSet({
                      title : '头像',
                      layout : 'fit',
                      height : 130,
                      items :[{
                          html : '<span id="image"><img src="/images/Temp.png" height=110px width=120px alt="图片" /></span>'
                      }]
                  })]
             },
              { 
                  defaults : { anchor : '95%'},
                  columnWidth: 1,
                  defaultType : 'textfield',
                  layout: "form",
                  items: [
                  { 
                      fieldLabel: "学号",
                      name: "number"
                  },
                  { 
                      fieldLabel: "姓名",
                      name: "name"
                  },
                  { 
                      fieldLabel: "班级",
                      name: "classes"
                  },
                  { 
                      fieldLabel: "性别",
                      name: "sex"
                  },
                  { 
                      fieldLabel: "联系电话",
                      name: "phone"
                  },
                  { 
                      xtype : 'textarea',
                      fieldLabel: "住址",
                      name: "home"
                  },
                  ]
              }
            ]
           }]
        });
        return formPanel;
    }
}
