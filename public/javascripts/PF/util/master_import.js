//Usage: new Pf.util.ImportXlsBtn({
//    actionName : 'the model you handling',
//    callBackStore : 'this configStroe will be reloaded after import successfully',
//    ...anthor Ext.Button configs...
//});
//
//Returning: An Ext.Button.

Pf.util.ImportXlsBtn = Ext.extend(Ext.Button,{
    constructor : function(config){
        Ext.applyIf(config,{
            text : '导入',
            icon : Pf.Icon.Upload
        });
        this.importWin = this.createUploadWin();  /*导入窗口*/
        this.handler = function() {this.importWin.show();};
        Pf.util.ImportXlsBtn.superclass.constructor.call(this,config);
    },

    createUploadWin : function(){
        var form = new Ext.FormPanel({
            height      : 80,
            frame       : true,
            labelWidth  : 1,
            fileUpload  : true, /*important!!*/
            defaults    : {
                anchor: '95%',
                allowBlank: false,
                msgTarget: 'side'
            },
            items : [{
                xtype      : 'fileuploadfield',
                emptyText  : 'select an excel',
                name       : 'master[attachment]',
                buttonText : 'Browse',
                listeners  : { 'fileselected' : {fn: this.onFileSelect, scope: this} }
            }],
            buttons: [{
                text      : 'Save',
                listeners : { 
                    'click' : { fn : this.submitFile, scope : this }
                }
            }]
        });

        var win = new Ext.Window({
            width       : 500,
            modal       : true,
            closeAction : 'hide',
            items       : form
        });

        return win;
    },

    onFileSelect : function(field) {
        var value = field.getValue();
        var pattern = /\.xls$|\.xls&/i;
        if (!pattern.test(value)){
            Ext.Msg.show({
                title   :"警告",
                msg     :"请选择一个xls格式文件.",
                buttons : Ext.MessageBox.OK ,
                icon    : Ext.MessageBox.INFO
            });
            field.setValue(null);
        };
    },

    submitFile : function () {
        var form = this.importWin.getComponent(0);
        var scope = this;
        if(form.getForm().isValid()){
            form.getForm().submit({
                url            : '/master/import?' + String.format("model_name={0}", this.actionName),
                standardSubmit : false,
                method         : 'post',
                waitMsg: '正在上传文件...',
                success: function(fp, action){
                    if(action.result == true) { 
                        scope.importWin.hide();
                        if (scope.callBackStore) {scope.callBackStore.reload();};
                        Ext.Msg.alert("Success", "导入成功。");
                    }
                },
                failure : function(fp, action){
                    Ext.Msg.alert("Error", action.result.error_msg);
                }
            });
        }
    }
});
