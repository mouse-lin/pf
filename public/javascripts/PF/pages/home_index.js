Ext.ns("Pf.classes.homeIndex");

Pf.classes.homeIndex.MainPanel = Ext.extend(Ext.Panel, {
    autoScroll : true,
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
                    { id : 'update-btn', text: '打印',   handler: Pf.util.scope(this.printHandler,this), icon : Pf.Icon.Print },
                ]
            }),
            items : [ this.form ]
        }];
    },

    createGrid : function() {
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
                'grade'
            ]
        });
        store.load();

        var cm = new Ext.grid.ColumnModel({
            columns: [
                { header: '学号' , dataIndex: 'number' },
                { header: '姓名' , dataIndex: 'name' },
            ],
            defaults: { menuDisabled : true, sortable : true }
        });

        var classCombox = new Ext.form.ComboBox({
            triggerAction : 'all',
            displayField  : 'name',
            mode          : 'remote',
            autoSelect    : true,
            width : 180,
            forceSelection : true,
            emptyText : '请选择班级',
            store : new Pf.util.FieldsJsonStore({
                url : '/homes/get_classes.json',
                fields  : ["id", "name"],
                autoLoad: false
            }),
        });

        var grid = new Ext.grid.EditorGridPanel({
            id : 'student-grid',
            store: store,
            cm   : cm,
            border: false,
            containerScroll: true,
            loadMask : true,
            frame : true,
            collapseMode: 'mini',
            width: 250,
            region: 'west',
            split: true,
            title : "学生列表",
            stripeRows: true,
            viewConfig: { forceFit: true },
            tbar: new Ext.Toolbar({
                layout : 'form',
                labelWidth : 1,
                items : ['班级:',classCombox, '学号查询：',new Ext.ux.form.SearchField({ emptyText : '请输入学号' ,store: store, width: 180 }) ]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: store,
                plugins: new Ext.ux.SlidingPager()
            }),
            sm : new Ext.grid.RowSelectionModel({
                listeners : {
                    rowselect : function (model, row, record) {
                        //加载成绩
                        var s_id = record.get("id");
                        var scoreGridStore = Ext.getCmp('score-grid').getStore();
                        scoreGridStore.load({ params : { s_id : s_id } });
                        //显示详细
                        var form = scope.form.getForm()
                        form.reset();
                        form.loadRecord(record);
                        //加载头像
                        $("#image img").attr("src", record.get('image/url'));
                    }
                }
            }),
            listeners: {  }
        });
        return grid;
    },

    createForm : function() {
        var store = new Pf.util.FieldsJsonStore({
            root : 'root',
            url  : '/homes/student_score.json',
            fields : ['course/name','grade','score','remark','score_type']
        });
        var cm = new Ext.grid.ColumnModel({
            columns: [
                { header: '学期' , dataIndex: 'grade',width  : 50 },
                { header: '科目' , dataIndex: 'course/name', width : 50,
                  summaryType: 'count',
                  summaryRenderer: function(v, params, data) { return ((v === 0 || v > 1) ? '(' + v + ' 科目)' : '(1 科目)'); }
                },
                { header: '成绩' , dataIndex: 'score', width : 50, 
                  summaryType: 'sum',
                  summaryRenderer: function(v, params, data) { return "总分: " + ( v ); }
                },
                { header: '成绩评级' , dataIndex: 'score_type', width : 50 },
                { header: '备注' , dataIndex: 'remark' },
            ],
            defaults: { menuDisabled : true, sortable : true }
        });

        var reader = new Ext.data.JsonReader({
            root : 'root',
            fields : ['course/name','grade','score','remark','score_type']
        });

        // utilize custom extension for Group Summary
        var summary = new Ext.ux.grid.GroupSummary();
        var ds = new Ext.data.GroupingStore({
            reader: reader,
            url  : '/homes/student_score.json',
            groupField: 'grade'
        });
        ds.on('beforeload', function(st, options) {
            st.setBaseParam('fields[]',store.fields.keys);
        });

        var grid = new Ext.grid.EditorGridPanel({
            id : 'score-grid',
            title : "学生成绩",
            store: ds,
            cm   : cm,
            loadMask :true,
            height : 200,
            frame : true,
            enableColumnMove: false,
            plugins: summary,
            stripeRows: true,
            viewConfig: { forceFit: true },
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false,
                enableGroupingMenu: false,
            }),
        });

        var form = new Ext.FormPanel({ 
            region : 'center',
            frame : true,
            autoScroll : true,
            labelWidth: 60,
            labelAlign : 'right',
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    width : 150,
                    layout: 'fit',
                    items: [new Ext.form.FieldSet({
                        title : '头像',
                        layout : 'fit',
                        height : 130,
                        items :[{
                            html : '<span id="image"><img src="/images/Temp.png" height=110px width=120px alt="图片" /></span>'
                        }]
                    })]
                }, {
                    defaults : { anchor : '95%', readOnly : true },
                    defaultType : 'textfield',
                    columnWidth: .25,
                    layout: 'form',
                    items: [{
                      fieldLabel: '学号',
                      name: 'number',
                    },{
                      fieldLabel: '姓名',
                      name: 'name',
                    },{
                      fieldLabel: '性别',
                      name: 'sex',
                    }, {
                      fieldLabel: '班级',
                      name: 'classes/name',
                    }]
                },{
                    defaults : { anchor : '95%' ,readOnly : true},
                    defaultType : 'textfield',
                    columnWidth: .45,
                    layout: 'form',
                    items: [ {
                      fieldLabel: '电话',
                      name: 'phone',
                    }, {
                      fieldLabel: '住址',
                      name: 'home',
                    }, {
                      xtype : 'textarea',
                      fieldLabel: '备注',
                      name: 'remark',
                      //height : 80
                    }]
                }]
              },new Ext.form.FieldSet({
                  title : '评语',
                  layout : 'fit',
                  items : [{
                      xtype: 'textarea',
                      name : 'comment',
                      height: 150,
                      readOnly : true,
                      anchor: '98%'
                  }]
              }),
              grid
            ]
        });
        return form;
    },

    printHandler : function() {
        var record = Ext.getCmp("student-grid").getSelectionModel().getSelected();
        if(record){  
            var url = 'students/print?id=' + record.data.id;
            var win = new Ext.Window({ 
                title: "资料打印",
                width: 800, 
                height: 500,
                resizable: false,
                modal: true,
                constrain: true,
                items: { html:'<iframe src='+ url + " frameborder='0'  width='100%' height='100%'></iframe>"}
            });
            win.show();
         }else
             Ext.Msg.alert("提示","请选择学生");
    },

});
