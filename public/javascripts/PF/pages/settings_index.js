Pf.settings.homeIndex = { 
    panel: function(){ 
        var _this = this;
        var grid = new Pf.classes.student();
        var studentScoreGrid = this.createStudentScoreGrid();
        var studentDetailFormPanel = this.createStudentDetail();
        grid.store.load();
        grid.on('cellclick', function(grid, rowIndex){ 
            var record = grid.store.getAt(rowIndex);
            if(record.data.type == "Student")
              studentScoreGrid.store.load({ params: { s_id: record.data.id }});
            else
              studentScoreGrid.store.removeAll();
            studentDetailFormPanel.getForm().loadRecord(record);
            $("#image img").attr("src",record.data["image/url(:thumb)"] );
            Ext.getCmp("identityType").disable();
        });

        //tabPanel更换为Panel
        var panel = new Ext.Panel({ 
            autoScroll : true,
            layout: "border",
            items: [{ 
                region: "center",
                title:  "学生(成绩)主档", 
                layout: "border",
                items: [
                    {region: "center",layout: "border",  items: grid },
                    {region:"east",width: 500,layout: "border", items:new Ext.Panel({
                        layout: "border",
                        region: "center",
                        tbar: [{ 
                             iconCls: "add",
                             text: "添加",
                             handler: function(){
                                 Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                                    if(button != "no"){
                                        if(Ext.getCmp("studentNumber").getValue() != "" &&  Ext.getCmp("studentName") != "" )
                                        { 
                                            _this.studentUpdateOrSave("create");
                                        }
                                        else
                                            Ext.Msg.alert("提示"," 姓名和学号不能为空!") 
                                    }
                                 })
                             }
                         }],
                        items: [ studentDetailFormPanel, studentScoreGrid]   
                    })}
                ]},
            ]
        });
        return panel;
    },
        
    //创建学生成绩grid
    createStudentScoreGrid: function(){ 
        var studentScoreStore = new Pf.util.FieldsJsonStore({ 
            fields: [
                "id",
                "grade",
                "course/name",
                "score",
                "remark"
            ],
            root : 'root',
            url  : '/homes/student_score.json',
        });

        function disableRender(value,metaData){ 
            metaData.attr = 'style="background-color: #e1e2e4"';
            return value;
        };

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '学期', sortable: true, dataIndex: 'grade', renderer: disableRender},
            { header: '科目', sortable: true, dataIndex: 'course/name', renderer: disableRender},
            { header: '成绩', sortable: true, dataIndex: 'score',editor:new Ext.form.NumberField() },
            { header: '备注', width: 150,sortable: true, dataIndex: 'remark', renderer: disableRender},
        ]);
        var grid = new Ext.grid.EditorGridPanel({ 
            id: "studentCourseScore",
            store: studentScoreStore,
            loadMask: true,
            cm: cm,
            height: 230,
            region: "south",
            tbar: [{ 
                iconCls:"add", text:"成绩录入",handler: function(){   alert("niaho") }
            },{ 
                iconCls:"table_edit", text:"成绩更新",handler: function(){  
                    var jsonData = Ext.getCmp("studentCourseScore").store.getModifiedRecords();
                    if(!jsonData[0]){ Ext.Msg.alert("提示","没有需要更新的数据"); }
                    else{  
                        var jsonObject = [];
                        Ext.each(jsonData,function(data){
                            jsonObject.push(data.data);
                        });
                        Ext.Ajax.request({
                            url: "/students/update_score.json",
                            method:  "POST",
                            jsonData: { jsonData: jsonObject, studentId: Ext.getCmp("studentShowGrid").getSelectionModel().getSelected().data.id } ,
                            success: function(response, opts){
                                Ext.Msg.alert("提示","保存成功");
                            },
                            failure: function(response, opts){
                                Ext.Msg.alert("提示","保存失败");
                            }
                        })
                    }
                }
            }],
        });
        return  grid;
    },

    createStudentDetail: function(){ 
        var _this = this;
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

        var typeData = [['Student','学生'],['Teacher','教师']];
        var typeCombo = new Ext.form.ComboBox({ 
            hiddenName: 'type',
            valueField: 'type',
            fieldLabel: "身份",
            id: "identityType",
            triggerAction: 'all',
            name: 'type',
            displayField: 'name',
            width: 180,
            mode: 'local',
            editable :  false,
            store: new Ext.data.SimpleStore({ 
                fields: ['type', 'name'],
                data: typeData,
            })
        });


        var classCombox = new Ext.form.ComboBox({
            hiddenName:  "classes_id",
            fieldLabel: "班级",
            triggerAction : 'all',
            displayField  : 'name',
            valueField: 'id',
            mode          : 'remote',
            width : 180,
            editable: false,
            forceSelection : true,
            emptyText : '请选择班级',
            store : new Pf.util.FieldsJsonStore({
                url : '/homes/get_classes.json',
                fields  : ["id", "name"],
                autoLoad: true 
            }),
         });

          
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
           title: "详细信息",
           region: "center",
           id: "studentDetailFormPanel",
           autoScroll : true,
           fileUpload: true,
           frame: true,
           labelAlign : 'right',
           buttonAlign: 'center',
           buttons: [
              { text: "更新", handler: function(){ _this.studentUpdateOrSave("update") } },
              { text: "重置", handler: function(){ 
                  Ext.getCmp("studentDetailFormPanel").getForm().reset()  
                  $("#image img").attr("src","/images/Temp.png" );
                  Ext.getCmp("identityType").enable();
              }}
           ],
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
                      fieldLabel: "学号(编号)",
                      name: "number",
                      id: "studentNumber",
                      allowBlank: false,
                  },
                  { 
                      fieldLabel: "姓名",
                      name: "name",
                      id: "studentName",
                      allowBlank: false,
                  },
                  classCombox,
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
                  typeCombo,
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
    },
      
    //学生保存或者更新触发函数
    studentUpdateOrSave: function(type){ 
        function request(record,grid){ 
            if(record == undefined)
                record = { data:{ id: "save" } };
            Ext.getCmp("studentDetailFormPanel").getForm().submit({ 
                method: "POST",
                waitMsg: "保存中",
                params: { id: record.data.id },
                url: "/students/update_student",
                success: function(form,action){ 
                    Ext.Msg.alert('提示', "保存成功");
                    if(grid){  
                        grid.store.on("load",function(){ 
                            var new_record = Ext.getCmp("studentShowGrid").getSelectionModel().getSelected();
                            if(new_record)
                            {   
                                $("#image img").attr("src",new_record.data["image/url(:thumb)"] );
                            }
                        });
                        grid.store.reload();
                        Ext.getCmp("photoField").reset();
                     }else{ 
                        Ext.getCmp("studentShowGrid").store.reload();
                     } 
                },
                failure: function(){ 
                    Ext.Msg.alert('提示', "保存失败");
                }
            });
        };
        if(type == "update"){  
            var grid = Ext.getCmp("studentShowGrid");
            var record = grid.getSelectionModel().getSelected();
            if(!record){ Ext.Msg.alert("提示","请选择学生") }
            else{  
                Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                    if(button != "no"){ 
                        request(record,grid);
                    }
                })
            };
         }else{ 
            request();
         }
    }
}
