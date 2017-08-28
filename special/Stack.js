class csObj {
    constructor(cs, args) {
        
        var eiValue = args[0] + "|";
        if (args[0].substr(0,1) != args[1].substr(0,1).toLowerCase()){
            obj = cs.new(args[0],['csid',-404]);
            eiValue += obj.assembly;
        }

        var ei = cs.edgeIn();
        ei.csid = -404;
        ei.name = 'stack';
        ei.file = eiValue;
        ei.act = 1; 
            
        let eo = cs.deWait(cs.sheath(ei));

        this.cs = cs;
        this.csid = eo.retval;

        this.typeValue = eo.parms[0].value;

    }
    release() {
        let ei = this.cs.edgeIn('', this.csid, 4);
        this.cs.sheath(ei);
    }
    get Count() {
        let ei = this.cs.edgeIn('Count', this.csid, 2, 4, '', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    get IsSynchronized() {
        let ei = this.cs.edgeIn('IsSynchronized', this.csid, 2, 2, '', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    get SyncRoot() {
        let ei = this.cs.edgeIn('SyncRoot', this.csid, 2, this.typeValue, 'T', '');
        return this.cs.callEdge(ei, [
            []
        ], []);
    }
    Clear() {
        let ei = this.cs.edgeIn('Clear', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Clone() {
        let ei = this.cs.edgeIn('Clone', this.csid, 3, this.typeValue, 'T');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Contains() {
        let ei = this.cs.edgeIn('Contains', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.typeValue, 'T', 0, 0, '')]
        ]);
    }
    CopyTo() {
        let ei = this.cs.edgeIn('CopyTo', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    GetEnumerator() {
        let ei = this.cs.edgeIn('GetEnumerator', this.csid, 3, -3, 'System.Collections.IEnumerator');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Peek() {
        let ei = this.cs.edgeIn('Peek', this.csid, 3, this.typeValue, 'T');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Pop() {
        let ei = this.cs.edgeIn('Pop', this.csid, 3, this.typeValue, 'T');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Push() {
        let ei = this.cs.edgeIn('Push', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(this.typeValue, 'T', 0, 0, '')]
        ]);
    }
    Synchronized() {
        let ei = this.cs.edgeIn('Synchronized', this.csid, 3, -1, 'System.Collections.Stack');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(-1, 'System.Collections.Stack', 0, 0, '')]
        ]);
    }
    ToArray() {
        let ei = this.cs.edgeIn('ToArray', this.csid, 3, 994, '');
        return this.cs.callEdge(ei, arguments, [
            []
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
            [this.cs.inParm(this.typeValue, 'T', 0, 0, '')]
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