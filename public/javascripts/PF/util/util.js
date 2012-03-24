Pf.util.scope = function(fn, obj, args){
    //  为fn创建 delegate（委托），这种写对于匿名回调函数比较明显。
    return fn.createDelegate(obj, args);
};

Pf.util.FieldsJsonStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(config){
        Ext.applyIf(config,{
            proxy : new Ext.data.HttpProxy({ method : 'GET', url : config.url }),
            root  : 'root',
            remoteSort : true,
        });
        
        Pf.util.FieldsJsonStore.superclass.constructor.call(this, config);
        this.on('beforeload', function(store, options) {
            //options.params = options.params || { };
            //options.params['fields[]'] = store.fields.keys;
            store.setBaseParam('fields[]',store.fields.keys);
        });
    },
     // 去掉skipFields中的项
   
});

Pf.util.Bbar = Ext.extend(Ext.PagingToolbar,{
    config : {
        pageSize : 25,
        emptyMsg : '没有记录',
        displayInfo : true,
        displayMsg    : "显示 {0} - {1} 总 {2} 条记录 ",
    },
    constructor : function(config){
        config = config || {};   // 如果没有传入config
        Ext.applyIf(config , this.config);
        Pf.util.Bbar.superclass.constructor.call(this, config);
    }
});

Pf.util.loadMask = {
    show: function(msg) {
        if(!Ext.isString(msg)) msg = "处理中...";
        (new Ext.LoadMask(Ext.getBody(), { msg: msg })).show();
        // From Van on 2011-10-06 => 用于修改 loadMask 显示 bug
        Ext.get(Ext.DomQuery.jsSelect(".ext-el-mask:last")).applyStyles("z-index: 10000;");
    },
    
    hide: function() {
        (new Ext.LoadMask(Ext.getBody())).hide();
    }
};

Pf.util.callback = {
    success: function() {
        Pf.util.loadMask.hide();
        Ext.Msg.alert( '提示', '操作成功');
    },
    
    failure: function(response, opts) {
        Pf.util.loadMask.hide();
        if(response.status == -1)
            var error_message = '操作超时，网络异常，检查后请重试...';
        else
            var error_message = Ext.decode(response.responseText).root.error_msg;
        Ext.Msg.alert(
             '提示', 
            error_message
        );
    },
    
    formFailure: function(form, action) {
        Pf.util.loadMask.hide();
        Ext.Msg.alert('提示', Ext.decode(action.response.responseText).root.error_msg);
    }
};
