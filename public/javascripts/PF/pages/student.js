Ext.ns("Pf.classes.student");
var store_name  = new Ext.data.JsonStore({ 
    fields: [
      
    ],
    root: 'content',
    url: 'store_url',
    totalProperty:'total',
    method:'GET',
});
var cm = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    { header: '', sortable: true, dataIndex: '',editor:new Ext.form.TextField()},
    { header: '', sortable: true, dataIndex: '',editor:new Ext.form.TextField()},
]);
var tbar = [
  { iconCls: '', text: '', handler: function(){ },
];
var  grid_name   = new Ext.grid.EditorGridPanel({ 
    viewConfig: { forceFit: true },
    store: store_name ,
    cm: cm,
    tbar: tbar, 
)};
return  grid_name  ;
