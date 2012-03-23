Pf.settings.homeIndex = { 
    panel: function(){ 
        var grid = new Pf.classes.student();
        var studentScoreGrid = this.createStudentScoreGrid();
        var studentDetailFormPanel = this.createStudentDetail();
        grid.store.load();
        grid.on('cellclick', function(grid, rowIndex){ 
            studentDetailFormPanel.getForm().setValues(grid.store.getAt(rowIndex).data);
            $("#image img").attr("src", '/images/Temp.png');
        });

        var panel = new Ext.TabPanel({ 
            autoScroll : true,
            activeTab: 0,
            frame: true,
            items: [
                { title:  "学生主档", 
                    layout: "border",
                    items: [
                        {region: "center",layout: "border", width: 900, items: grid },
                        {region:"east",width: 500, layout: "border", items:[ studentDetailFormPanel, studentScoreGrid]}]   
                },
                { title:  "学生主档", html: "mouse"  },
            ]
        });
        return panel;
    },

    createStudentScoreGrid: function(){ 
        var studentScoreStore = new Pf.util.FieldsJsonStore({ 
            fields: [
            ],
            root : 'root',
            url  : '/homes/get_classes_students.json',
        });
        var cm = new Ext.grid.ColumnModel([
            { header: '初一第一学期', sortable: true, dataIndex: ''},
            { header: '初一第二学期', sortable: true, dataIndex: ''},
            { header: '初二第一学期', sortable: true, dataIndex: ''},
            { header: '初二第二学期', sortable: true, dataIndex: ''},
            { header: '初三第一学期', sortable: true, dataIndex: ''},
            { header: '初三第二学期', sortable: true, dataIndex: ''},
        ]);
        var grid_name = new Ext.grid.EditorGridPanel({ 
            viewConfig: { forceFit: true },
            store: studentScoreStore,
            loadMask: true,
            cm: cm,
            height: 250,
            region: "south",
            bbar : new Pf.util.Bbar({ store : studentScoreStore }),
        });
        return  grid_name;
    },

    createStudentDetail: function(){ 
        var sexData = [['男','男'],['女','女']];
        var sexCombo = new Ext.form.ComboBox({ 
            //id: 'targetCombo',
            valueField: 'sex',
            fieldLabel: "性别",
            triggerAction: 'all',
            name: 'sex',
            displayField: 'sexName',
            width: 180,
            mode: 'local',
            editable :  false,
            store: new Ext.data.SimpleStore({ 
                fields: ['sex', 'sexName'],
                data: sexData,
                //autoLoad: true,
            })
        });

        var formPanel = new Ext.form.FormPanel({ 
           title: "test",
           region: "center",
           autoScroll : true,
           fileUpload: true,
           frame: true,
           labelAlign : 'right',
           buttonAlign: 'center',
           buttons: [{ text: "更新", handler: function(){ alert("nihai") } }],
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
                  defaults : { anchor : '95%', },
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
                      name: "classes/name"
                  },
                     sexCombo,
                     // fieldLabel: "性别",
                     // name: "sex"
                  { 
                      fieldLabel: "联系电话",
                      name: "phone"
                  },
                  { 
                      xtype : 'textarea',
                      fieldLabel: "住址",
                      name: "home"
                  },
                  {  
                      xtype: 'fileuploadfield',
                      allowBlank : true,
                      emptyText: '选择',
                      fieldLabel: '头像',
                      name: 'size_sheet',
                      buttonText: '上传',
                      listeners: { 'fileselected' : {fn: this.onFileSelect, scope: this} }
                  }
                  ]
              }
            ]
           }]
        });
        return formPanel;
    }
}
