Ext.ns("Pf.classes.homeIndex");

Pf.classes.homeIndex.MainPanel = Ext.extend(Ext.Panel, {
    autoScroll : true,
    title      : '学生信息',
    layout     : 'border',
    
    initComponent : function  () {
        this.addDefaultComponents();
        Pf.classes.homeIndex.MainPanel.superclass.initComponent.call(this);
        //this.addEvents();
        //this.initEvents();
    },

    addDefaultComponents : function(){
        this.grid = this.createGrid();
        this.form = this.createForm();
        this.items = [this.grid,{
            region : 'center',
            layout : 'anchor',
            items : [this.form,{
                xtype:'htmleditor',
                name: 'remark',
                height:200,
                anchor:'50%'
            }]
        }];
    },

    //initEvents : function(){
    //  
    //},
    //

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
          defaults: {  }
        });

        var grid = new Ext.grid.EditorGridPanel({
          region : 'west',
          store: store,
          cm   : cm,
          border: false,
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
            anchor : '50%',
            frame : true,
            height : 500,
            lableWidth: 50,
            defaults: {
                anchor: '95%',
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [  ],
        });
        return form;
    },

});
