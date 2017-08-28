'use strict'

class edgeSheath{

     constructor(){
        
        this.classPrefix = '';

        var fs = require('fs');
        var xml2js = require('xml2js');
   
        this.fixedDirName = __dirname.replace(/\\/g,'/') + "/"; 
        this._libPath =  this.fixedDirName + 'sheath/lib/js/'; 
        
        if (!fs.existsSync(this._libPath)){
            
            let config = fs.readFileSync(this.fixedDirName + 'sheath/Sheath.exe.config','utf8');
       
            xml2js.parseString(config,((error,result) => {
                this._libPath=result.configuration.appSettings[0].add[0].$.value + '/lib/js/';
                
                if (!fs.existsSync(this._libPath)){
                    throw ("can not resolve lib path");
                }

            }))
        }

        this.objs = {};
        this.enums = {};

        this.edge = require('edge');
        this.cSharp =this.edge.func(this.fixedDirName + 'sheath/sheath.cs');

        this.deAsync = require('deasync');
        this.deLoop = this.deAsync.runLoopOnce;

        this.csPrimitives = {};
        this.csPrimitives['string'] = 1;
        this.csPrimitives['bool'] = 2;
        this.csPrimitives['datetime'] = 3;
        this.csPrimitives['int'] = 4;
        this.csPrimitives['double'] = 5;
        this.csPrimitives['uint'] = 6;
        this.csPrimitives['long'] = 7;
        this.csPrimitives['ulong'] = 8;
        this.csPrimitives['float'] = 9;
        this.csPrimitives['short'] = 10;
        this.csPrimitives['ushort'] = 11;
        this.csPrimitives['decimal'] = 12;
        this.csPrimitives['byte'] = 13;
        this.csPrimitives['sbyte'] = 14;
        this.csPrimitives['char'] = 15;
        this.csPrimitives['dynamic'] = 16;
        this.csPrimitives['object'] = 16;
   
  }

  edgeIn(name='',csid=0,act=0,retType=0,retjsObj='',list='',assembly='',file=''){

        let aka = {};

        aka.csid = csid;
        aka.name = name;
        aka.assembly = assembly;
        aka.file = file;
        aka.act = act; //1 create,2 read, 3 update, 4 delete
        aka.index = null;
        aka.ret = this.inParm();
        aka.ret.type = retType;
        aka.ret.jsObj = retjsObj;
        aka.ret.list = list;
        aka.parms = [];

        return aka;
    }

    edgeOut(){

        let aka = {};

        aka.retval;
        aka.errmsg = '';
        aka.parms = [];

        return aka;
    }

    inParm(type,jsObj='',byRef=0,isArray=0,list=''){
    
        let aka = {};

        aka.type = type;
        aka.byRef = byRef;
        aka.isArray = isArray;
        aka.jsObj = jsObj;
        aka.list = list;
        return aka;

    }

    get stub(){

        return  class stub{
            
            constructor(){
    
                this._csid = null;
                this._name = null;
                this.assembly = null;
                this._type = 0;
                this._value = null;

            }

            
            set csid(val){this._csid = val;}
            get csid(){return this._csid;}
            
            set name(val){this._name = val;}
            get name(){return this._name;}
                
            set type(val){this._type = val;}
            get type(){return this._type;}

            set assembly(val){this._assembly = val;}
            get assembly(){return this._assembly;}

            set value(val){this._value = val;}
            get value(){return this._value;}
        }

    }

    parm() {

        let aka = {};

        aka.type = 0;
        aka.value;

        return aka;
    }


    callEdge(ei,args,ctors){
        
        let iparms = [];
        let hitIndex = -1;
        let byRefCount = 0;

        if (ctors.length != 0) {

            for (let i = 0; i < ctors.length; i++) {
                let ctorLen = (args.length);
                if (ctorLen == ctors[i].length) {
                    hitIndex = i;
                    break;
                }
            }
            
            if (hitIndex == -1){
                //bad error?
            }else{
                
                iparms = ctors[hitIndex];
                
                for (let i = 0; i < iparms.length; i++) {
                    let tparm =  this.parm();
                    if (iparms[i].byRef == 1) byRefCount++;
                    tparm.type = iparms[i].type;
                    tparm.value = this.setValue(iparms[i],(args[i]));
                    ei.parms.push(tparm);
                }
            }
        }

        let eo = null;

        try{
    
            eo = this.deWait(this.sheath(ei));
        
            if (ei.act == 1){
                //only create objects
                ei.ret.type = 2;
            }

            if (ei.ret.type != 0){ //void
                eo.retval = this.getValue(ei.ret,eo.retval);
            }

            if (byRefCount > 0) {

                for (let i = 0; i < args.length; i++) {
                    if (iparms[i].byRef == 1){
                        args[i] = this.getValue(iparms[i],eo.parms[i].value);
                    }    
                }
            }
            
            return eo.retval;

        }
        catch(err)
        {
            return null;        
        }        
    }
    
    setValue(iparm,val) {
        
        let retVal = null;
 
        if (iparm.type < 0){ //class
            retVal = val.csid ;      
        }else{
            this.checkList(iparm,val);
            retVal = val;
        }

        
        return retVal;
    }

    getValue(iparm,val) {
        
        let retVal;
        
        if (iparm.type < 0){ //class
            retVal = this.new("*" + iparm.jsObj,['csid', val]);
        }else{
            this.checkList(iparm,val);    
            retVal = val;
        }
        
        return retVal;
    }

    checkList(parm,val){

        var listName = parm.list;
        if (listName != ''){
            var e = this.objs[listName];
            var hit = false;
            for (let i = 0;i<e.els.length;i++){
                if (e.els[i] == val){
                    hit = true;
                }
            }
            if (!hit){
                //blow up
            }
        }
    }
    
    deWait(promise) {
        var result, error, done = false;
        promise.then(function(res) {
            result = res;
        }, function(err) {
            error = err;
        }).then(function() {
            done = true;
        });
        while(!done) {
            this.deLoop();
        }
        if (error) {
            throw error;
        }
        return result;
    }

    sheath (edgeIn) {
        return new Promise((resolve, reject) => {
            this.cSharp(edgeIn,((error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            }))
        })
    }

    set prefix(val){
        if (!val.endsWith('.')) val += '.';
        this.classPrefix = val;
    }

    new(className,parms = []) {
        
        let typeID = this.csPrimitives[className]; 
        
        if (typeID != undefined){
        
            let temp = new this.stub;
            temp.type = typeID;
            temp.name = className;
            if (parms.length == 2) temp.csid = parms[1];
            return temp;
        }

        let fullName = this.classPrefix + className;  
 
        if (className.substr(0,1)== '*'){
            fullName = className.substr(1);
        }
        try{    
            this.objs[fullName] = require(this._libPath + 'objs/' + fullName + '.js');
        }
        catch(ex){}

        if (this.objs[fullName] == undefined){
            try{
                this.objs[fullName] = require(this.fixedDirName + 'special/' + className + '.js');
            }catch(ex){}
        }

        let retVal = null;
        
        try{
            retVal = new this.objs[fullName](this,parms);
        }catch(ex){
            throw('can not find class');
        }

        return retVal;
    }

    e(className) {

        let fullName = this.classPrefix + className;  
 
        if (className.substr(0,1) == '*'){
            fullName = className.substr(1);
        }

        if (this.enums[fullName] == undefined){
            this.enums[fullName] = require(this._libPath + 'enums/' + fullName + '.js');
        }

        let retVal = null;

        try{
            retVal = new this.enums[fullName];
        }catch(ex){
            throw('can not find enums');
        }

        return retVal;

    }
}

module.exports = new edgeSheath();