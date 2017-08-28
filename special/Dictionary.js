class csObj {

    constructor(cs, args) {
        
        var obj = null;
        
        this.keyObj = cs.new(args[0],['csid',-404]);
     
        var eiKey = this. keyObj.name + "|" +this. keyObj.assembly;
        
        this.dataObj = cs.new(args[1],['csid',-404]);
        var eiData = this.dataObj.name + "|"  + this.dataObj.assembly;
        
        var ei = cs.edgeIn();
        ei.csid = -404;
        ei.name = 'dictionary';
        ei.act = 1; 
        ei.assembly = eiKey;
        ei.file = eiData;

        let eo = cs.deWait(cs.sheath(ei));

        this.cs = cs;
        this.csid = eo.retval;
  
    }

    release() {
        let ei = this.cs.edgeIn('', this.csid, 4);
        this.cs.sheath(ei);
    }
    get Comparer() {
        let ei = this.cs.edgeIn('Comparer', this.csid, 2, -12, 'System.Collections.Generic.IEqualityComparer`1', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    get Count() {
        let ei = this.cs.edgeIn('Count', this.csid, 2, 4, '', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    get Keys() {
        let ei = this.cs.edgeIn('Keys', this.csid, 2, this.keyObj.type, '', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    get Values() {
        let ei = this.cs.edgeIn('Values', this.csid, 2, this.dataObj.type, '', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    Item(index, val) {
        let canWrite = true;
        let ei = this.cs.edgeIn('Item', this.csid);
        ei.index = index;
        ei.act = (canWrite && val != undefined && val != null) ? 3 : 2;
        if (canWrite && ei.act == 3) {
            return this.cs.callEdge(ei, [val], [
                [this.cs.inParm(this.dataObj.type, '', 0, 0, '')]
            ]);
        }
        if (ei.act == 2) {
  
            ei.ret.type = this.dataObj.type;
            ei.ret.jsObj = this.dataObj.name;
            return this.cs.callEdge(ei, [
                []
            ], []);
        }
    }

    ValueAt(index, val) {
        let canWrite = true;
        let ei = this.cs.edgeIn('edValueAt', this.csid);
        ei.index = index;
        ei.act = (canWrite && val != undefined && val != null) ? 3 : 2;
        if (canWrite && ei.act == 3) {
            return this.cs.callEdge(ei, [val], [
                [this.cs.inParm(this.dataObj.type, '', 0, 0, '')]
            ]);
        }
        if (ei.act == 2) {
  
            ei.ret.type = this.dataObj.type;
            ei.ret.jsObj = this.dataObj.name;
            return this.cs.callEdge(ei, [
                []
            ], []);
        }
    }
    KeyAt(index) {
        let canWrite = false;
        let ei = this.cs.edgeIn('edKeyAt', this.csid);
        ei.index = index;
        ei.act = (canWrite && val != undefined && val != null) ? 3 : 2;
        if (canWrite && ei.act == 3) {
            return this.cs.callEdge(ei, [val], [
                [this.cs.inParm(this.dataObj.type, '', 0, 0, '')]
            ]);
        }
        if (ei.act == 2) {
  
            ei.ret.type = this.dataObj.type;
            ei.ret.jsObj = this.dataObj.name;
            return this.cs.callEdge(ei, [
                []
            ], []);
        }
    }
    Add() {
        let ei = this.cs.edgeIn('Add', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.keyObj.type, '', 0, 0, ''), this.cs.inParm(this.dataObj.type, '', 0, 0, '')]
        ]);
    }
    Clear() {
        let ei = this.cs.edgeIn('Clear', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    ContainsKey() {
        let ei = this.cs.edgeIn('ContainsKey', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.keyObj.type, '', 0, 0, '')]
        ]);
    }
    ContainsValue() {
        let ei = this.cs.edgeIn('ContainsValue', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, '', 0, 0, '')]
        ]);
    }
    GetEnumerator() {
        let ei = this.cs.edgeIn('GetEnumerator', this.csid, 3, -12, 'System.Collections.Generic.Dictionary`2+Enumerator');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    GetObjectData() {
        let ei = this.cs.edgeIn('GetObjectData', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'System.Runtime.Serialization.SerializationInfo', 0, 0, ''), this.cs.inParm(-2, 'System.Runtime.Serialization.StreamingContext', 0, 0, '')]
        ]);
    }
    OnDeserialization() {
        let ei = this.cs.edgeIn('OnDeserialization', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-6, 'System.Object', 0, 0, '')]
        ]);
    }
    Remove() {
        let ei = this.cs.edgeIn('Remove', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(1, '', 0, 0, '')]
        ]);
    }
    TryGetValue() {
        let ei = this.cs.edgeIn('TryGetValue', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(1, '', 0, 0, ''), this.cs.inParm(1, '', 1, 0, '')]
        ]);
    }
    ToString() {
        let ei = this.cs.edgeIn('ToString', this.csid, 3, 1, '');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Equals() {
        let ei = this.cs.edgeIn('Equals', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-6, 'System.Object', 0, 0, '')]
        ]);
    }
    GetHashCode() {
        let ei = this.cs.edgeIn('GetHashCode', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
}
module.exports = csObj;