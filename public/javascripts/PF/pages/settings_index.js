Pf.settings.homeIndex = { 
    panel: function(){ 
        var grid = new Pf.classes.student();
        var studentScoreGrid = this.createStudentScoreGrid();
        var studentDetailFormPanel = this.createStudentDetail();
        grid.store.load();
        grid.on('cellclick', function(grid, rowIndex){ 
            var record = grid.store.getAt(rowIndex).data;
            studentDetailFormPanel.getForm().setValues(record);
            $("#image img").attr("src",record["image/url"] );
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
            })
        });
          
        //保存更新按钮
        function onSave(){ 
            var grid = Ext.getCmp("studentShowGrid");
            var record = grid.getSelectionModel().getSelected();
            if(!record){ Ext.Msg.alert("提示","请选择学生") }
            else{  
                Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                    if(button != "no"){ 
                        Ext.getCmp("studentDetailFormPanel").getForm().submit({ 
                              clientValidation: true,
                              method: "POST",
                              waitMsg: "保存中",
                              params: { id: record.data.id },
                              url: "/students/update_student",
                              success: function(form,action){ 
                                  Ext.Msg.alert('提示', "保存成功");
                                  grid.store.on("load",function(){ 
                                      var new_record = Ext.getCmp("studentShowGrid").getSelectionModel().getSelected();
                                      if(new_record)
                                      {   
                                          $("#image img").attr("src",new_record.data["image/url"] );
                                      }
                                  });
                                  grid.store.reload();
                                  Ext.getCmp("photoField").reset();
                              },
                              failure: function(){ 
                                  Ext.Msg.alert('提示', "保存失败");
                              }
                        });
                    }
                })
            }
        };

        //判断上传文件
        function onFileSelect(field){
            var value = field.getValue();
            var pattern = /\.jpg$|\.jpeg$|\.bmp$|\.png|\.gif$|\.png&/i;
            if (!pattern.test(value)){
                Ext.Msg.show({
                    title:"警告",
                    msg:"必须是JPG，GIF，PNG，BMP格式图片文件！",
                    buttons: Ext.MessageBox.OK ,
                    icon: Ext.MessageBox.INFO
                });
                field.setValue("");
            };
        };

        var formPanel = new Ext.form.FormPanel({ 
           title: "test",
           region: "center",
           id: "studentDetailFormPanel",
           autoScroll : true,
           fileUpload: true,
           frame: true,
           labelAlign : 'right',
           buttonAlign: 'center',
           buttons: [{ text: "更新", handler: function(){ onSave() } }],
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
                      id: "photoField",
                      fieldLabel: '头像',
                      name: 'photo',
                      buttonText: '上传',
                      listeners: { 'fileselected' : {fn: onFileSelect, scope: this} }
                  }
              ]}
            ]
           }]
        });
        return formPanel;
    }
}
