Pf.settings.comment = { 
    panel: function(){ 
        var _this = this;
        var commentTypeGrid = this.createcommentTypeGrid();
        var commentTypeFormPanel = this.createCommentTypeFormPanel();
        var commentGrid = this.createCommentGrid();
        var commentPanel = this.createCommentFormPanel();

        commentTypeGrid.on('cellclick', function(grid, rowIndex){ 
            var record = commentTypeGrid.store.getAt(rowIndex);
            commentTypeFormPanel.getForm().loadRecord(record);
        });

        commentGrid.on('cellclick', function(grid, rowIndex){ 
            var record = commentGrid.store.getAt(rowIndex);
            commentPanel.getForm().loadRecord(record);
        });

        commentTypeGrid.store.load();
        commentGrid.store.load();

        var panel = new Ext.Panel({ 
            title: "评语设置",
            autoScroll: true,
            layout: "border",
            items: [
                {
                    region: "center", 
                    layout: "border", 
                    items:[{    
                        region: "center",
                        layout: "border",
                        items: [commentTypeGrid]
                    },{ 
                        region: "east",
                        layout: "border",
                        tbar:[{ text:"添加", iconCls: "add", handler: function(){
                            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                               if(button != "no"){
                                    if(Ext.getCmp("commentTypeName").getValue() != "")
                                    { 
                                        _this.ajaxRequest("CommentType","create");
                                    }
                                    else
                                        Ext.Msg.alert("提示","评语类别名称不能为空!") 
                               }
                            })
                        }}],
                        width: 350,
                        items: [commentTypeFormPanel]
                    }]
                },{ 
                    region: "south",
                    layout: "border",
                    height: 320,
                    items: [{
                        region: "center",
                        layout: "border",
                        items: [commentGrid]
                    },{ 
                        region: "east",
                        layout: "border",
                        tbar:[{ text: "添加", iconCls: "add", handler: function(){ 
                            Ext.Msg.confirm('提示', "是否确定保存?", function(button){ 
                               if(button != "no"){
                                    if(Ext.getCmp("commentContent").getValue() != "")
                                    { 
                                        _this.ajaxRequest("Comment","create");
                                    }
                                    else
                                        Ext.Msg.alert("提示","评语内容不能为空!") 
                               }
                            })
                        }}],
                        width: 350,
                        items: [commentPanel]
                    }]
                }]
        })
        return panel;
    },

    ajaxRequest: function(objectType,action,id){ 
        if(!id) 
          id = "null";
        var formName = objectType == "CommentType" ? "commentTypeFormPanel" : "commentPanel";
        var formData = Ext.getCmp(formName).getForm().getValues();
        var data = { object_type: objectType, action_type: action, form_data: formData, id: id}
        Ext.Ajax.request({
            url: "/settings/ajax_request.json",
            method:  "POST",
            jsonData: data ,
            success: function(response, opts){ 
                objectType == "CommentType" ? Ext.getCmp("commentTypeGrid").store.reload(): Ext.getCmp("commentGrid").store.reload();
                Ext.Msg.alert("提示","保存成功");
            },
            failure: function(response, opts){
                Ext.Msg.alert("提示","保存失败");
            }
        })
    },

    createCommentFormPanel: function(){ 
        var _this = this;
        var commentTypeCombox = new Ext.form.ComboBox({
            hiddenName:  "comment_type_id",
            fieldLabel: " 评语类别",
            triggerAction : 'all',
            displayField  : 'name',
            valueField: 'id',
            mode          : 'remote',
            width : 180,
            editable: false,
            forceSelection : true,
            emptyText : '请选择评语类别',
            store : new Pf.util.FieldsJsonStore({
                url : '/settings/comment_type.json',
                fields  : ["id", "name"],
                autoLoad: true 
            }),
         });

        var panel = new Ext.form.FormPanel({ 
            region: "center",
            id: "commentPanel",
            autoScroll : true,
            frame: true,
            buttonAlign: "center",
            bodyStyle: 'padding:40px 10px',
            buttons: [{ 
                text: "更新", handler: function(){ 
                    var grid = Ext.getCmp("commentGrid");
                    var record = grid.getSelectionModel().getSelected();
                    if(!record){ Ext.Msg.alert("提示","请选择评语") }
                    else{  
                        Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                            if(button != "no"){ 
                               _this.ajaxRequest("Comment","update",record.id);
                            }
                        })
                    };
                }
            },{ 
                text: "重置", handler: function(){ Ext.getCmp("commentPanel").getForm().reset() }
            }],
            items: [{ 
                layout: "column",
                items:[{ 
                    defaults: { anchor: "95%" },
                    columnWidth: 1,
                    labelWidth: 70,
                    defaultType: "textfield",
                    layout: "form",
                    items:[{ 
                        fieldLabel: "评语内容",
                        name: "content",
                        id: "commentContent",
                        allowBlank: false,
                    },
                    commentTypeCombox,
                    { 
                        fieldLabel: "备注",
                        name: "remark",
                        xtype: "textarea",
                    }]
                }]
            }]
        });
        return panel;
    },

    createCommentGrid: function(){ 
        var commentGridStore =  new Pf.util.FieldsJsonStore({ 
            fields: [
                "id",
                "content",
                "remark",
                "created_at",
                "updated_at",
                "comment_type/name",
                "comment_type_id",
            ],
            root: 'root',
            url: '/settings/comment.json',
            totalProperty:'total',
            method:'GET',
        });

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '评语内容', sortable: true, dataIndex: 'content'},
            { header: '评语类别', sortable: true, dataIndex: 'comment_type/name'},
            { header: '备注', sortable: true, dataIndex: 'remark'},
            { header: '创建时间', sortable: true, dataIndex: 'created_at'},
            { header: '更新时间', sortable: true, dataIndex: 'updated_at'},
        ]);

        var tbar = [
          { iconCls: 'delete', text: '删除', handler: function(){
                var grid = Ext.getCmp("commentGrid");
                var record = grid.getSelectionModel().getSelected();
                if(!record){ Ext.Msg.alert("提示","请选择评语") }
                else{  
                    Ext.Msg.confirm('提示', "是否确定删除?", function(button){ 
                        if(button != "no"){
                            Pf.util.loadMask.show();
                            Ext.Ajax.request({
                                url: "/settings/destroy_comment.json",
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

        var commentGrid = new Ext.grid.EditorGridPanel({ 
            loadMask: true,
            id: "commentGrid",
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: { forceFit: true },
            store: commentGridStore,
            region: "center",
            cm: cm,
            tbar: tbar, 
            bbar: new Pf.util.Bbar({ store: commentGridStore })
        });
        return commentGrid;
    },

    createCommentTypeFormPanel: function(){ 
        var _this = this;
        var panel = new Ext.form.FormPanel({ 
            region: "center",
            id: "commentTypeFormPanel",
            autoScroll : true,
            frame: true,
            buttonAlign: "center",
            bodyStyle: 'padding:40px 10px',
            buttons: [{ 
                text: "更新", handler: function(){ 
                    var grid = Ext.getCmp("commentTypeGrid");
                    var record = grid.getSelectionModel().getSelected();
                    if(!record){ Ext.Msg.alert("提示","请选择评语类别") }
                    else{  
                        Ext.Msg.confirm("提示","是否确定保存更改",function(button){ 
                            if(button != "no"){ 
                                _this.ajaxRequest("CommentType","update",record.id);
                            }
                        })
                    };
                }
            },{ 
                text: "重置", handler: function(){ Ext.getCmp("commentTypeFormPanel").getForm().reset() }
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
                        id: "commentTypeName",
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

    createcommentTypeGrid: function(){ 
        var commentTypeGridStore = new Pf.util.FieldsJsonStore({ 
            fields: [
              "name",
              "id",
              "created_at",
              "updated_at",
              "remark",
            ],
            root: 'root',
            url: '/settings/comment_type.json',
            totalProperty:'total',
            method:'GET',
        });
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '类别名称', sortable: true, dataIndex: 'name'},
            { header: '备注', sortable: true, dataIndex: 'remark'},
            { header: '创建时间', sortable: true, dataIndex: 'created_at'},
            { header: '更新时间', sortable: true, dataIndex: 'updated_at'},
        ]);
        var tbar = [
          { iconCls: 'delete', text: '删除', handler: function(){
                var grid = Ext.getCmp("commentTypeGrid");
                var record = grid.getSelectionModel().getSelected();
                if(!record){ Ext.Msg.alert("提示","请选择评语类别") }
                else{  
                    Ext.Msg.confirm('提示', "是否确定删除?", function(button){ 
                        if(button != "no"){
                            Pf.util.loadMask.show();
                            Ext.Ajax.request({
                                url: "/settings/destroy_comment_type.json",
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
        var  commentTypeGrid   = new Ext.grid.EditorGridPanel({ 
            loadMask: true,
            id: "commentTypeGrid",
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            region: "center",
            viewConfig: { forceFit: true },
            store: commentTypeGridStore,
            cm: cm,
            tbar: tbar, 
            bbar: new Pf.util.Bbar({ store: commentTypeGridStore })
        });
        return  commentTypeGrid;
    }
}
