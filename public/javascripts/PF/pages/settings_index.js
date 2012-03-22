Pf.settings.homeIndex = { 
    panel: function(){ 
        var grid = new Pf.classes.student();
        grid.store.load();
        var grid2 = new Pf.classes.student();
        var panel = new Ext.TabPanel({ 
            autoScroll : true,
            activeTab: 0,
            autpLoad: true,
            frame: true,
            items: [
                { title:  "学生主档", items: grid  },
                { title:  "学生主档", items: grid2  },
            ]
        });
        return panel;
    } 
}
