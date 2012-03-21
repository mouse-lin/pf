Ext.ns("Pf.classes.homeIndex");

Pf.classes.homeIndex.MainPanel = Ext.extend(Ext.Panel, {
    autoScroll : true,
    title      : '学生信息',
    layout     : 'border',
    region     : 'center',
    
    initComponent : function  () {
        this.addDefaultComponents();
        Pf.classes.homeIndex.MainPanel.superclass.initComponent.call(this);
    },

    addDefaultComponents : function(){
        this.grid = this.createGrid();
        this.form = this.createForm();

        this.items = [this.grid,{
            title : '学生详细信息',
            region : "center",
            layout : 'fit',
            tbar : new Ext.Toolbar({
                id : 'form-tbar',
                items : [
                    { id : 'update-btn', text: '打印',   handler: Pf.util.scope(this.printHandler,this) },
                    { id : 'save-btn', text: '更新评语', handler: Pf.util.scope(this.updateHandler,this) },
                ]
            }),
            items : [ this.form ]
        }];
    },

    createGrid : function() {
        var store = new Pf.util.FieldsJsonStore({
            root : 'root',
            url  : '#',
            fields : ["id",'name','number']
        });

        var cm = new Ext.grid.ColumnModel({
            columns: [
                { header: '学号' , dataIndex: 'number' },
                { header: '姓名' , dataIndex: 'name' },
            ],
            defaults: { menuDisabled : true, sortable : true }
        });

        var grid = new Ext.grid.EditorGridPanel({
            store: store,
            cm   : cm,
            border: false,
            containerScroll: true,
            width: "12%",
            region: 'west',
            split: true,
            title : "学生列表",
            stripeRows: true,
            viewConfig: { forceFit: true },
            //tbar: tbar,
            listeners: {  }
        });
        return grid;
    },

    createForm : function() {
        var form = new Ext.FormPanel({ 
            region : 'center',
            frame : true,
            lableWidth: 50,
            defaults: {
                allowBlank: false,
                msgTarget: 'side'
            },
            items : [],
        });
        return form;
    },

    printHandler : function  () {
      
    },

    updateHandler : function  () {
      // body...
    }

});
