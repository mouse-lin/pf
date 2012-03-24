Pf.settings.classes = { 
    panel: function(){ 
        var _this = this;
        var classesGrid = this.createClassesGrid();
        var classesFormPanel = this.createClassesFormPanel();
        var courseGrid = this.createCourseGrid();
        var courseFormPanel = this.createCourseFormPanel();

        classesGrid.on('cellclick', function(grid, rowIndex){ 
            var record = classesGrid.store.getAt(rowIndex);
            classesFormPanel.getForm().loadRecord(record);
        });

        courseGrid.on('cellclick', function(grid, rowIndex){ 
            var record = courseGrid.store.getAt(rowIndex);
            courseFormPanel.getForm().loadRecord(record);
        });

        classesGrid.store.load();
        courseGrid.store.load();

        var panel = new Ext.Panel({ 
            title: "班别科目主档",
            autoScroll: true,
            layout: "border",
            items: [
                {
                    region: "center", 
                    layout: "border", 
                    items:[{    
                        region: "center",
                        layout: "border",
                        items: [classesGrid]
                    },{ 
                        region: "east",
                        layout: "border",
                        tbar:[{ text:"添加", iconCls: "add", handler: function(){
                            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                               if(button != "no"){
                                    if(Ext.getCmp("classesName").getValue() != "")
                                    { 
                                        _this.ajaxRequest("Classes","create");
                                    }
                                    else
                                        Ext.Msg.alert("提示","班别名称不能为空!") 
                               }
                            })
                        }}],
                        width: 350,
                        items: [classesFormPanel]
                    }]
                },{ 
                    region: "south",
                    layout: "border",
                    height: 300,
                    items: [{
                        region: "center",
                        layout: "border",
                        items: [courseGrid]
                    },{ 
                        region: "east",
                        layout: "border",
                        tbar:[{ text: "添加", iconCls: "add", handler: function(){ 
                            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                               if(button != "no"){
                                    if(Ext.getCmp("courseName").getValue() != "")
                                    { 
                                        _this.ajaxRequest("Course","create");
                                    }
                                    else
                                        Ext.Msg.alert("提示","科目名称不能为空!") 
                               }
                            })
                        }}],
                        width: 350,
                        items: [courseFormPanel]
                    }]
                }]
        })
        return panel;
    },

    ajaxRequest: function(objectType,action,id){ 
        if(!id) 
          id = "null";
        var formName = objectType == "Classes" ? "classesFormPanel" : "courseFormPanel";
        var formData = Ext.getCmp(formName).getForm().getValues();
        var data = { object_type: objectType, action_type: action, form_data: formData, id: id}
        Ext.Ajax.request({
            url: "/settings/ajax_request.json",
            method:  "POST",
            jsonData: data ,
            success: function(response, opts){ 
                objectType == "Classes" ? Ext.getCmp("classesGrid").store.reload(): Ext.getCmp("courseGrid").store.reload();
                Ext.Msg.alert("提示","保存成功");
            },
            failure: function(response, opts){
                Ext.Msg.alert("提示","保存失败");
            }
        })
    },

    createCourseFormPanel: function(){ 
        var _this = this;
        var panel = new Ext.form.FormPanel({ 
            region: "center",
            id: "courseFormPanel",
            autoScroll : true,
            frame: true,
            buttonAlign: "center",
            bodyStyle: 'padding:40px 10px',
            buttons: [{ 
                text: "更新", handler: function(){ 
                    var grid = Ext.getCmp("courseGrid");
                    var record = grid.getSelectionModel().getSelected();
                    if(!record){ Ext.Msg.alert("提示","请选择科目") }
                    else{  
                        Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                            if(button != "no"){ 
                               _this.ajaxRequest("Course","update",record.id);
                            }
                        })
                    };
                }
            },{ 
                text: "重置", handler: function(){ Ext.getCmp("courseFormPanel").getForm().reset() }
            }],
            items: [{ 
                layout: "column",
                items:[{ 
                    defaults: { anchor: "95%" },
                    columnWidth: 1,
                    labelWidth: 50,
                    defaultType: "textfield",
                    layout: "form",
                    items:[{ 
                        fieldLabel: "名称",
                        name: "name",
                        id: "courseName",
                        allowBlank: false,
                    },{ 
                        fieldLabel: "备注",
                        name: "remark",
                        xtype: "textarea",
                    }]
                }]
            }]
        });
        return panel;
    },

    createCourseGrid: function(){ 
        var courseGridStore =  new Pf.util.FieldsJsonStore({ 
            fields: [
                "id",
                "name",
                "remark",
                "created_at",
                "updated_at",
            ],
            root: 'root',
            url: '/settings/get_course.json',
            totalProperty:'total',
            method:'GET',
        });

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '名称', sortable: true, dataIndex: 'name'},
            { header: '备注', sortable: true, dataIndex: 'remark'},
            { header: '创建时间', sortable: true, dataIndex: 'created_at'},
            { header: '更新时间', sortable: true, dataIndex: 'updated_at'},
        ]);

        var tbar = [
          { iconCls: 'delete', text: '删除', handler: function(){
                var grid = Ext.getCmp("courseGrid");
                var record = grid.getSelectionModel().getSelected();
                if(!record){ Ext.Msg.alert("提示","请选择班别") }
                else{  
                    Ext.Msg.confirm('提示', "是否确定删除?", function(button){ 
                        if(button != "no"){
                            Pf.util.loadMask.show();
                            Ext.Ajax.request({
                                url: "/settings/destroy_course.json",
                                method: "POST",
                                jsonData: { id: record.id } ,
                                success: function(response, opts){
                                    Pf.util.callback.success();
                                    Ext.Msg.alert("提示","删除成功");
                                    grid.store.reload();
                                },
                                failure: function(response, opts){
                                    Pf.util.callback.failure();
                                }
                            })
                        }
                    })
                }
          }},
        ];

        var courseGrid = new Ext.grid.EditorGridPanel({ 
            loadMask: true,
            id: "courseGrid",
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: { forceFit: true },
            store: courseGridStore,
            region: "center",
            cm: cm,
            tbar: tbar, 
            bbar: new Pf.util.Bbar({ store: courseGridStore })
        });
        return courseGrid;
    },

    createClassesFormPanel: function(){ 
        var _this = this;
        var panel = new Ext.form.FormPanel({ 
            //title: "班级信息",
            region: "center",
            id: "classesFormPanel",
            autoScroll : true,
            frame: true,
            buttonAlign: "center",
            bodyStyle: 'padding:40px 10px',
            buttons: [{ 
                text: "更新", handler: function(){ 
                    var grid = Ext.getCmp("classesGrid");
                    var record = grid.getSelectionModel().getSelected();
                    if(!record){ Ext.Msg.alert("提示","请选择班级") }
                    else{  
                        Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                            if(button != "no"){ 
                                _this.ajaxRequest("Classes","update",record.id);
                            }
                        })
                    };
                }
            },{ 
                text: "重置", handler: function(){ Ext.getCmp("classesFormPanel").getForm().reset() }
            }],
            items: [{ 
                layout: "column",
                items:[{ 
                    defaults: { anchor: "95%" },
                    columnWidth: 1,
                    labelWidth: 50,
                    defaultType: "textfield",
                    layout: "form",
                    items:[{ 
                        fieldLabel: "班别",
                        name: "name",
                        id: "classesName",
                        allowBlank: false,
                    },{ 
                        fieldLabel: "备注",
                        name: "remark",
                        xtype: "textarea",
                    }]
                }]
            }]
        });
        return panel;
    },

    createClassesGrid: function(){ 
        var classesGridStore = new Pf.util.FieldsJsonStore({ 
            fields: [
              "name",
              "id",
              "created_at",
              "updated_at",
              "remark",
              "students/count",
            ],
            root: 'root',
            url: '/settings/classes.json',
            totalProperty:'total',
            method:'GET',
        });
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '班别', sortable: true, dataIndex: 'name'},
            { header: '备注', sortable: true, dataIndex: 'remark'},
            { header: '班人数', sortable: true, dataIndex: 'students/count'},
            { header: '创建时间', sortable: true, dataIndex: 'created_at'},
            { header: '更新时间', sortable: true, dataIndex: 'updated_at'},
        ]);
        var tbar = [
          { iconCls: 'delete', text: '删除', handler: function(){
                var grid = Ext.getCmp("classesGrid");
                var record = grid.getSelectionModel().getSelected();
                if(!record){ Ext.Msg.alert("提示","请选择班别") }
                else{  
                    Ext.Msg.confirm('提示', "是否确定删除?", function(button){ 
                        if(button != "no"){
                            Pf.util.loadMask.show();
                            Ext.Ajax.request({
                                url: "/settings/destroy_classes.json",
                                method: "POST",
                                jsonData: { id: record.id } ,
                                success: function(response, opts){
                                    Pf.util.callback.success();
                                    Ext.Msg.alert("提示","删除成功");
                                    grid.store.reload();
                                },
                                failure: function(response, opts){
                                    Pf.util.callback.failure();
                                }
                            })
                        }
                    })
                }
          }},
        ];
        var  classesGrid   = new Ext.grid.EditorGridPanel({ 
            loadMask: true,
            id: "classesGrid",
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            region: "center",
            viewConfig: { forceFit: true },
            store: classesGridStore,
            cm: cm,
            tbar: tbar, 
            bbar: new Pf.util.Bbar({ store: classesGridStore })
        });
        return  classesGrid;
    }
}
