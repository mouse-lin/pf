Ext.ns("Pf.classes.commentStudent");

Ext.onReady(function() { 
    Pf.classes.commentStudent = new Pf.classes.commentStudent.MainPanel();
    Pf.pages.currentInstance = Pf.classes.commentStudent;
});

Pf.classes.commentStudent.MainPanel = Ext.extend(Ext.Panel, {
    autoScroll : true,
    region     : 'center',
    layout     : 'border',
   
    initComponent : function  () {
        this.addDefaultComponents();
        Pf.classes.commentStudent.MainPanel.superclass.initComponent.call(this);
    },

    addDefaultComponents : function(){
        this.tree = this.createTree();
        this.commentGrid = this.createCommentGrid();
        this.studentForm = this.createForm();
        this.items = [ {
            region : 'center',
            layout : 'border',
            items : [
                this.tree,
                this.commentGrid,
                new Ext.FormPanel({ 
                    region: 'south',
                    frame : true,
                    height : 180,
                    labelAlign : 'top',
                    items: [ { xtype : 'textarea',fieldLabel: "评语", id : 's-comment', width : "100%", height : 145  } ],
                }),
            ]},
            this.studentForm
        ]
            
    },

    createTree : function  () {
        root = new Ext.tree.AsyncTreeNode({ text: '类型', expanded: true,nodeType: 'async' });
        var tree = new Ext.tree.TreePanel({
            autoScroll: true,
            containerScroll: true,
            region: "west",
            title: "评价类型",
            width: 130,
            split: true,
            frame : true,
            collapseMode: 'mini',
            loader: new Ext.tree.TreeLoader({ dataUrl: '/homes/comment_type_tree_nodes.json', requestMethod: 'POST', preloadChildren: false }),
            root: root,
            listeners: { 
                click : function  (node) {
                    if(node.isLeaf){
                        var store = Ext.getCmp('comment-grid').getStore();
                        store.removeAll();
                        store.load({ params : { ct_id : node.attributes.id } });
                    }
                }
            }
        });
        return tree;
    },

    createCommentGrid : function  () {
        var scope = this;
        var store = new Pf.util.FieldsJsonStore({
            root : 'root',
            url  : '/homes/commets_by_type.joson',
            fields : ["id",'content']
        });
        var cm = new Ext.grid.ColumnModel({
          columns: [
              { header: '评价详情' , dataIndex: 'content' },
          ],
          defaults: { menuDisabled : true, sortable : true }
        });
        var grid = new Ext.grid.EditorGridPanel({
            id : 'comment-grid',
            region : 'center',
            store: store,
            border: false,
            title : '评价详细',
            stripeRows: true,
            loadMask : true,
            viewConfig: { forceFit: true },
            bbar : new Pf.util.Bbar({ store : store }),
            cm   : cm,
            sm : new Ext.grid.RowSelectionModel({ }),
            listeners: { 
                celldblclick : function(grid,rowIndex,columnIndex) {
                    var content = grid.getStore().getAt(rowIndex).get("content");
                    scope.addComment(content,false);
                }
            }
        });
        return grid;
    },

    createForm : function  () {
        var scope = this;
        var classCombox = new Ext.form.ComboBox({
            fieldLabel    : '班级',
            triggerAction : 'all',
            displayField  : 'name',
            mode          : 'remote',
            autoSelect    : true,
            width : 130,
            forceSelection : true,
            store : new Pf.util.FieldsJsonStore({
                url : '/homes/get_classes.json',
                fields  : ["id", "name"],
                autoLoad: false
            }),
            listeners : {
                select : function(combo, record, index) {
                }
            }
        });
        
        var form = new Ext.FormPanel({ 
          region : 'east',
          title : '学生信息',
          frame : true,
          autoScroll : true,
          width : 280,
          lableWidth: 55,
          labelAlign : 'top',
          bodyStyle: 'padding:5px 15px 0',
          defaults : { anchor : '95%' },
          defaultType : 'textfield',
          layout: 'form',
          items: [
              new Ext.form.FieldSet({
                  title : '头像',
                  layout : 'fit',
                  height : 140,
                  items :[{
                      html : '<span id="image"><img src="/images/Temp.png" height=110px width=120px alt="图片" /></span>'
                  }]
              }),
                classCombox
              ,{
                fieldLabel: '学号',
                name: 'number',
              },{
                fieldLabel: '姓名',
                name: 'name',
              },{
                fieldLabel: '性别',
                name: 'sex',
              },{
                fieldLabel: '班级',
                name: 'classes/name',
              }, {
                fieldLabel: '总分',
                name: 'total_score',
              }, {
                fieldLabel: '评级',
                name: 'grade',
              }
          ],
          buttonAlign: 'center',
          buttons: [
              { text : '保存', handler : function() { scope.saveComment() } },
              { text : '清除', handler : function() { scope.addComment("",true) } },
              { text : '重置', handler : function() { scope.addComment(currentStu.get('comment'), true)} }
          ]
        });
        return form;
    },

    addComment : function  (content, clear) {
        var commentArea = Ext.getCmp('s-comment');
        if (clear) {
            commentArea.setValue(content);
        }else{
            commentArea.setValue(commentArea.getValue() + content);
        };
    },

    saveComment : function () {
        
    }

});
      
