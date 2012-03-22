Pf.settings.homeIndex = { 
    panel: function(){ 
        var panel = new Ext.Panel({ 
            autoScroll : true,
            layout: "anchor",
            title: "nihao",
            frame: true,
            items:  new Ext.form.FormPanel({ 
                anchor: "100 100",
                title: '测试',
            })
        });
        return panel;
    } 
}
