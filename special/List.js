class csObj {
    constructor(cs, args) {
        
          var obj = null;
        
        this.dataObj = cs.new(args[1],['csid',-404]);
        var eiData = this.dataObj.name + "|"  + this.dataObj.assembly;
        
        var ei = cs.edgeIn();
        ei.csid = -404;
        ei.name = 'list';
        ei.act = 1; 
        ei.file = eiData;

        let eo = cs.deWait(cs.sheath(ei));

        this.cs = cs;
        this.csid = eo.retval;

    }
    release() {
        let ei = this.cs.edgeIn('', this.csid, 4);
        this.cs.sheath(ei);
    }
    set Capacity(val) {
        let ei = this.cs.edgeIn('Capacity', this.csid, 3, 0);
        this.cs.callEdge(ei, [val], [
            [this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    get Capacity() {
        let ei = this.cs.edgeIn('Capacity', this.csid, 2, 4, '', '');
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
    Item(index, val) {
        let canWrite = true;
        let ei = this.cs.edgeIn('Item', this.csid);
        ei.index = index;
        ei.act = (canWrite && val != undefined && val != null) ? 3 : 2;
        if (canWrite && ei.act == 3) {
            return this.cs.callEdge(ei, [val], [
                [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')]
            ]);
        }
        if (ei.act == 2) {
            ei.ret.type = this.dataObj.type;
            ei.ret.jsObj = this.objData.name;
            return this.cs.callEdge(ei, [
                []
            ], []);
        }
    }
    Add() {
        let ei = this.cs.edgeIn('Add', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')]
        ]);
    }
    AddRange() {
        let ei = this.cs.edgeIn('AddRange', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-3, 'IEnumerable`1', 0, 0, '')]
        ]);
    }
    AsReadOnly() {
        let ei = this.cs.edgeIn('AsReadOnly', this.csid, 3, -1, 'ReadOnlyCollection`1');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    BinarySearch() {
        let ei = this.cs.edgeIn('BinarySearch', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(-3, 'IComparer`1', 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(-3, 'IComparer`1', 0, 0, '')]
        ]);
    }
    Clear() {
        let ei = this.cs.edgeIn('Clear', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Contains() {
        let ei = this.cs.edgeIn('Contains', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')]
        ]);
    }
    ConvertAll() {
        let ei = this.cs.edgeIn('ConvertAll', this.csid, 3, -1, 'List`1');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Converter`2', 0, 0, '')]
        ]);
    }
    CopyTo() {
        let ei = this.cs.edgeIn('CopyTo', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(988, '', 1, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
            [this.cs.inParm(988, '', 1, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(988, '', 1, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Exists() {
        let ei = this.cs.edgeIn('Exists', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    FindIndex() {
        let ei = this.cs.edgeIn('FindIndex', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-1, 'Predicate`1', 0, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    ForEach() {
        let ei = this.cs.edgeIn('ForEach', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Action`1', 0, 0, '')]
        ]);
    }
    GetEnumerator() {
        let ei = this.cs.edgeIn('GetEnumerator', this.csid, 3, -2, 'Enumerator');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    IndexOf() {
        let ei = this.cs.edgeIn('IndexOf', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Insert() {
        let ei = this.cs.edgeIn('Insert', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')]
        ]);
    }
    InsertRange() {
        let ei = this.cs.edgeIn('InsertRange', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-3, 'IEnumerable`1', 0, 0, '')]
        ]);
    }
    LastIndexOf() {
        let ei = this.cs.edgeIn('LastIndexOf', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')],
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Remove() {
        let ei = this.cs.edgeIn('Remove', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.dataObj.type, this.objData.name, 0, 0, '')]
        ]);
    }
    RemoveAll() {
        let ei = this.cs.edgeIn('RemoveAll', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    RemoveAt() {
        let ei = this.cs.edgeIn('RemoveAt', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    RemoveRange() {
        let ei = this.cs.edgeIn('RemoveRange', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Reverse() {
        let ei = this.cs.edgeIn('Reverse', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Sort() {
        let ei = this.cs.edgeIn('Sort', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [],
            [this.cs.inParm(-3, 'IComparer`1', 0, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-3, 'IComparer`1', 0, 0, '')],
            [this.cs.inParm(-1, 'Comparison`1', 0, 0, '')]
        ]);
    }
    ToArray() {
        let ei = this.cs.edgeIn('ToArray', this.csid, 3, 988, '');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    TrimExcess() {
        let ei = this.cs.edgeIn('TrimExcess', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Find() {
        let ei = this.cs.edgeIn('Find', this.csid, 3, this.dataObj.type, this.objData.name);
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    FindAll() {
        let ei = this.cs.edgeIn('FindAll', this.csid, 3, -9, 'System.Collections.Generic.List`1');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    FindLast() {
        let ei = this.cs.edgeIn('FindLast', this.csid, 3, this.dataObj.type, this.objData.name);
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    FindLastIndex() {
        let ei = this.cs.edgeIn('FindLastIndex', this.csid, 3, 4, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-1, 'Predicate`1', 0, 0, '')],
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
        ]);
    }
    GetRange() {
        let ei = this.cs.edgeIn('GetRange', this.csid, 3, -9, 'System.Collections.Generic.List`1');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    TrueForAll() {
        let ei = this.cs.edgeIn('TrueForAll', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'Predicate`1', 0, 0, '')]
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