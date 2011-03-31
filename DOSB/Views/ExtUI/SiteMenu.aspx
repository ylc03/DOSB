<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

[{
    text:'Sales',
    expanded: true,
    children:[{
        text:'Fields',
        iconCls: 'silk-map',
        id:'ca-fields',
        leaf:true
    },{
        text:'Job Types',
        iconCls: 'silk-map',
        id:'ca-assembly',
        leaf:true
    },{
        text:'Well Informations',
        iconCls: 'silk-map',
        id:'ca-wellinfo',
        leaf:true
    },{
        text:'Year View',
        id:'ca-yview',
        iconCls: 'silk-calendar-month',
        leaf:true
    },{
        text:'Month View',
        iconCls: 'silk-calendar-week',
        id:'ca-mview',
        leaf:true
    },{
        text:'Statistics',
        iconCls: 'silk-chart-curve',
        id:'ca-stat',
        leaf:true
    }]
},{
    text:'Job Tracking',
	expanded: true,
    children:[{
        text:'Job Tracking Sheet',
        id:'job-ts',
        leaf:true
    },{
        text:'Job Flow Chart',
        id:'job-fc',
        leaf:true
    },{
        text:'Mateial Requests',
        id:'job-mr',
        leaf:true
    },{
        text:'SAM',
        id:'job-sam',
        leaf:true
    }]
},{
    text:'Workshop',
	expanded: true,
    children:[{
        text:'Daily Activity PVD',
        id:'wkshop-da',
        leaf:true
    },{
        text:'Torque Logs',
        id:'wkshop-tl',
        leaf:true
    },{
        text:'Pressure Test Logs',
        id:'wkshop-pt',
        leaf:true
    },{
        text:'Tech&Recp Logs',
        id:'wkshop-tr',
        leaf:true
    }]
},{
    text:'Employee',
	expanded: true,
    children:[{
        text:'Employee List',
        id:'emp-ls',
        leaf:true
    },{
        text:'Role List',
        id:'role-ls',
        leaf:true
    },{
        text:'Employee Certificates',
        id:'emp-cert',
        leaf:true
    }]
},{
    text:'Material',
	expanded: true,
    children:[{
        text:'Store',
        id:'mat-store',
        leaf:true
    },{
        text:'PO Tracking',
        id:'mat-po',
        leaf:true
    },{
        text:'Other Stuff',
        id:'mat-other',
        leaf:true
    }]
}]