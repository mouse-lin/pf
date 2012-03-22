Ext.ns("Pf.classes.student");

Pf.classes.student = Ext.extend(Ext.grid.EditorGridPanel,{ 
    viewConfig: { forceFit: true },
    height: 600,
    initComponent : function  () {
        this.store = this.initStore();
        this.cm = this.initCm();
        this.tbar = this.initStudentTbar();
        Pf.classes.student.superclass.initComponent.call(this);
    },
    initStore: function(){ 
        var store  = new Ext.data.JsonStore({ 
            fields: [
                "name",
                "number",
                "sex",
                "phone",
                "home",
                "class_name",
            ],
            root: 'root',
            url: '/students/get_all_students.json',
            totalProperty:'total',
            method:'GET',
        });
        return store;
    },
    initCm: function(){ 
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: '学号', sortable: true, dataIndex: 'number',editor:new Ext.form.TextField()},
            { header: '姓名', sortable: true, dataIndex: 'name',editor:new Ext.form.TextField()},
            { header: '班级', sortable: true, dataIndex: 'class_name',editor:new Ext.form.TextField()},
            { header: '性别', sortable: true, dataIndex: 'sex',editor:new Ext.form.TextField()},
            { header: '联系电话', sortable: true, dataIndex: 'phone',editor:new Ext.form.TextField()},
            { header: '住址', sortable: true, dataIndex: 'home',editor:new Ext.form.TextField()},
        ]);
        return cm;
    },
    initStudentTbar: function(){ 
        var tbar = [
            { iconCls: "add", text: "添加" },
            { iconCls: "delete", text: "删除" },
            { iconCls: "table_edit", text: "编辑" },
            { iconCls: "table_edit", text: "详细" },
        ];
        return tbar;
    }
})
