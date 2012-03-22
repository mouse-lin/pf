Ext.ns("Pf.classes.student");

Pf.classes.student = Ext.extend(Ext.grid.EditorGridPanel,{ 
    viewConfig: { forceFit: true },
    //title: "学生主档",
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
              
            ],
            root: 'content',
            url: 'store_url',
            totalProperty:'total',
            method:'GET',
        });
        return store;
    },
    initCm: function(){ 
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            { header: 'mouse', sortable: true, dataIndex: '',editor:new Ext.form.TextField()},
            { header: 'cat', sortable: true, dataIndex: '',editor:new Ext.form.TextField()},
        ]);
        return cm;
    },
    initStudentTbar: function(){ 
        var tbar = [{ iconCls: "add", text: "添加" }];
        return tbar;
    }
})
