Ext.ns("Pf.classes.student");

Pf.classes.student = Ext.extend(Ext.grid.EditorGridPanel,{ 
    viewConfig: { forceFit: true },
    height: 600,
    sm: new Ext.grid.RowSelectionModel({
        singleSelect: true
    }),
    initComponent : function  () {
        this.store = this.initStore();
        this.cm = this.initCm();
        this.tbar = this.initStudentTbar();
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
                "name",
                "number",
                "sex",
                "phone",
                "home",
                "classes/name",
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
                iconCls: "add",
                text: "添加",
                handler: function(){  alert("niha")}
            },
            { iconCls: "delete", text: "删除" },
            { iconCls: "table_edit", text: "编辑" },
            { iconCls: "table_edit", text: "详细" },
        ];
        return tbar;
    }
})
