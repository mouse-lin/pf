Ext.ns("Pf.classes.student");

Pf.classes.student = Ext.extend(Ext.grid.EditorGridPanel,{ 
    viewConfig: { forceFit: true },
    region: "center",
    loadMask: true,
    id: "studentShowGrid",
    sm: new Ext.grid.RowSelectionModel({
        singleSelect: true
    }),
    initComponent : function  () {
        this.store = this.initStore();
        this.cm = this.initCm();
        this.tbar = this.initStudentTbar();
        this.bbar = new Pf.util.Bbar({ store: this.store });
        Pf.classes.student.superclass.initComponent.call(this);
    },
    initStudentEditor: function(){ 
       var editor = new Ext.ux.grid.RowEditor({
        saveText: 'Update'
       });
       return editor;
    },
    initStore: function(){ 
        var store  = new Pf.util.FieldsJsonStore({
            fields: [
                "id",
                "name",
                "number",
                "sex",
                "phone",
                "home",
                "classes/name",
                "image/url(:thumb)",
            ],
            root: 'root',
            url: '/students/get_all_students.json',
        });
        return store;
    },

    initCm: function(){ 
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '学号', sortable: true, dataIndex: 'number'},
            { header: '姓名', sortable: true, dataIndex: 'name'},
            { header: '班级', sortable: true, dataIndex: 'classes/name'},
            { header: '性别', sortable: true, dataIndex: 'sex'},
            { header: '联系电话', sortable: true, dataIndex: 'phone'},
            { header: '住址', sortable: true, dataIndex: 'home'},
        ]);
        return cm;
    },

    initStudentTbar: function(){ 
        var _this = this;
        var tbar = [
            { 
                iconCls: "delete",
                text: "删除",
                handler: function(){ 
                    var grid = Ext.getCmp("studentShowGrid");
                    var record = grid.getSelectionModel().getSelected();
                    if(!record){ Ext.Msg.alert("提示","请选择学生") }
                    else{  
                        Ext.Msg.confirm('提示', "是否确定删除?", function(button){ 
                            if(button != "no"){
                                Pf.util.loadMask.show();
                                var studentId = record.id;
                                Ext.Ajax.request({
                                    url: "/students/destroy_student.json",
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
                }
             },
        ];
        return tbar;
    },

    addSingleStudent: function(){ 
        var win = new Ext.Window({ 
            title: "添加学生",
            width: 650, 
            height: 400,
            id: "addSingleStudentWin",
            modal: true,
            constrain: true,
            layout: 'anchor',
            buttonAlign: 'center',
            buttons: [
                { text: "保存" },
                { text: "取消", handler: function(){ Ext.getCmp("addSingleStudentWin").close() } }
            ]
        });
        return win;
    },
})
