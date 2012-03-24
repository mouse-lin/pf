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
        currentClasses = undefined;
        currentStu = undefined;
        this.addDefaultComponents();
        Pf.classes.commentStudent.MainPanel.superclass.initComponent.call(this);
    },

    addDefaultComponents : function(){
        this.tree = this.createTree();
        this.commentGrid = this.createCommentGrid();
        this.totalScoreGrid = this.createTotalScoreGrid();
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
                })
            ]},{
                width : 280,
                region : 'east',
                layout : 'border',
                autoScroll : true,
                items : [this.studentForm,this.totalScoreGrid]
            }
        ]

        this.studentGrid = this.createStudentGrid();
        this.studentWin = this.createStudentWin();
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
                        store.setBaseParam('ct_id', node.attributes.id);
                        store.load();
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
            cm   : cm,
            border: false,
            title : '评价详细',
            stripeRows: true,
            loadMask : true,
            viewConfig: { forceFit: true },
            bbar : new Pf.util.Bbar({ store : store }),
            tbar: ['  ','查询: ', ' ', new Ext.ux.form.SearchField({ store: store, width: 320 })],
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

    createStudentWin : function  () {
        var studentWin = new Ext.Window({
            title : '请选择学生',
            closeAction: 'hide',
            width: 700,
            height: 400,
            modal: true,
            constrainHeader: true,
            layout: 'fit',
            items: this.studentGrid,
            buttons: [
                { text: '关闭', handler:function(){ studentWin.hide(); } },
            ]
        });
        return studentWin;
    },

    createForm : function  () {
        var scope = this;

        var studentField = new Ext.ux.form.SearchField({ 
            id          : 'fbillerid',
            name        : 'name',
            fieldLabel  : '学生',
            emptyText   : '请选择学生',
            editable    : false,
            onTrigger2Click : function() {
                //if (currentClasses != undefined) {
                  scope.studentGrid.getStore().load(); 
                //};
                scope.studentWin.show();
            }
        });
        
        var form = new Ext.FormPanel({ 
          region: 'center',
          title : '学生信息',
          frame : true,
          autoScroll : true,
          labelWidth: 40,
          labelAlign: 'left',
          bodyStyle: 'padding:5px 15px 0',
          defaults : { anchor : '95%', width : 200 },
          defaultType : 'textfield',
          items: [
              new Ext.form.FieldSet({
                  title : '头像',
                  layout : 'fit',
                  height : 140,
                  items :[{
                      html : '<span id="image"><img src="/images/Temp.png" height=110px width=120px alt="图片" /></span>'
                  }]
              }),
              studentField 
              ,{
                fieldLabel: '学号',
                name: 'number',
                readOnly: true
              },{
                fieldLabel: '班级',
                name: 'classes/name',
                readOnly: true
              }, {
                fieldLabel: '性别',
                name: 'sex',
                readOnly: true
              },{
              //  fieldLabel: '评级',
              //  name: 'grade',
              //  readOnly: true
              //}, {
                fieldLabel: '备注',
                name: 'remark',
                readOnly: true
              },
          ],
          buttonAlign: 'center',
          bbar : [ 
              //{ text : '上一个', icon : Pf.Icon.Fornt, handler : scope.getStudent("fornt") },
              //{ text : '下一个', icon : Pf.Icon.Next, handler : scope.getStore("next") },
          ],
          buttons: [
              { text : '保存', handler : function() { scope.saveComment() } },
              { text : '清除', handler : function() { scope.addComment("",true) } },
              { text : '重置', handler : function() { scope.addComment(currentStu.get('comment'), true)} }
          ]
        });
        return form;
    },

    createTotalScoreGrid : function  () {
        var store = new Pf.util.FieldsJsonStore({
          root : 'root',
          url  : '/students/student_total_score.json',
          fields : ['grade', 'total_score']
        });
        var cm = new Ext.grid.ColumnModel({
          columns: [
              { header: '学期' , dataIndex: 'grade' },
              { header: '总分' , dataIndex: 'total_score' },
          ],
          defaults: { menuDisabled : true , sortable : false }
        });
        var grid = new Ext.grid.EditorGridPanel({
            region: 'south',
            height : 230,
            collapsible: true,
            loadMask : true,
            frame : true,
            //collapseMode: 'mini',
            store: store,
            cm   : cm,
            border: false,
            title : '各学期总成绩',
            stripeRows: true,
            viewConfig: { forceFit: true },
        });
        return grid;
    },

    createStudentGrid : function() {
        var scope = this;
        var store = new Pf.util.FieldsJsonStore({
            root : 'root',
            url  : '/homes/get_students.json',
            fields : [
                "id",
                'name',
                'number',
                'phone',
                'home',
                'remark' ,
                'sex',
                'classes/name',
                'comment',
                'image/url',
                //'grade',
              ]
        });
        store.load();

        var cm = new Ext.grid.ColumnModel({
            columns: [
                { header: '学号' , dataIndex: 'number' },
                { header: '姓名' , dataIndex: 'name' },
                { header: '电话' , dataIndex: 'phone' },
                { header: '住址' , dataIndex: 'home' },
                { header: '性别' , dataIndex: 'sex' },
                { header: '备注' , dataIndex: 'remark' },
            ],
            defaults: { menuDisabled : true, sortable : true }
        });

        var classCombox = new Ext.form.ComboBox({
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
                    var store = Ext.getCmp("student-grid").getStore();
                    store.removeAll();
                    store.setBaseParam("c_id",record.get("id"));
                    currentClasses = record;
                    store.load();
                }
            }
        });

        var grid = new Ext.grid.EditorGridPanel({
            id : 'student-grid',
            store: store,
            cm   : cm,
            border: false,
            containerScroll: true,
            loadMask : true,
            width: 200,
            region: 'west',
            split: true,
            title : "学生列表",
            stripeRows: true,
            viewConfig: { forceFit: true },
            tbar: new Ext.Toolbar({
                items : [
                    '班级:',classCombox,'->',
                    '学号查询: ', ' ', new Ext.ux.form.SearchField({ store: store, width: 220 })
                    ]
            }),
            bbar: new Pf.util.Bbar({ store : store }),
            sm : new Ext.grid.RowSelectionModel({ }),
            listeners: { 
                celldblclick : function(grid,rowIndex,columnIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    var form = scope.studentForm.getForm()
                    form.reset();
                    form.loadRecord(record);
                    //加载头像
                    $("#image img").attr("src", record.get('image/url'));
                    currentStu = record;
                    scope.addComment(currentStu.get('comment'), true);

                    var st = scope.totalScoreGrid.getStore();
                    st.removeAll();
                    st.load({ params : { s_id : record.get("id") } });
                    scope.studentWin.hide();
                }
            }
        });
        return grid;
    },

    addComment : function  (content, clear) {
        var commentArea = Ext.getCmp('s-comment');
        if (clear) {
            commentArea.setValue(content);
        }else{
            commentArea.setValue(commentArea.getValue() + content);
        };
    },

    saveComment : function() {
        if (currentStu == undefined) {return;};
        Ext.Msg.confirm("系统提示","确认保存学生'"+currentStu.get("name")+"'的评价信息？",function  (button,text) {
            if (button == "yes") {
                saveHandler.call(this);
            };
        },this);

        function saveHandler () {
            Ext.Ajax.request({
                url: '/students/' + currentStu.get("id") + '/update_student_comment.json',
                method : "POST",
                jsonData: { comment : Ext.getCmp('s-comment').getValue() },
                success: function  (response,onpts) {
                    Ext.Msg.alert("提示","保存成功。");
                },
                failure: function  (response, onpts) {
                    var msg = Ext.decode(response.responseText).root.error_msg;
                    Ext.Msg.alert("", msg);
                }
            });
        }
    }

});
      
