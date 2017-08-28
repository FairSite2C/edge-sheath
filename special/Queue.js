class csObj {
    constructor(cs, args) {
        
        obj = cs.new(args[0],['csid',-404]);
        var eiValue = args[0] + "|"  + obj.assembly;

        var ei = cs.edgeIn();
        ei.csid = -404;
        ei.name = 'queue';
        ei.file = eiValue;
        ei.act = 1; 
            
        let eo = cs.deWait(cs.sheath(ei));

        this.cs = cs;
        this.csid = eo.retval;

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
    Clear() {
        let ei = this.cs.edgeIn('Clear', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    CopyTo() {
        let ei = this.cs.edgeIn('CopyTo', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(1, '', 0, 1, ''), this.cs.inParm(4, '', 0, 0, '')]
        ]);
    }
    Enqueue() {
        let ei = this.cs.edgeIn('Enqueue', this.csid, 3, 0, '');
        this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(1, '', 0, 0, '')]
        ]);
    }
    GetEnumerator() {
        let ei = this.cs.edgeIn('GetEnumerator', this.csid, 3, -12, 'System.Collections.Generic.Queue`1+Enumerator');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Dequeue() {
        let ei = this.cs.edgeIn('Dequeue', this.csid, 3, 1, '');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Peek() {
        let ei = this.cs.edgeIn('Peek', this.csid, 3, 1, '');
        return this.cs.callEdge(ei, arguments, [
            []
        ]);
    }
    Contains() {
        let ei = this.cs.edgeIn('Contains', this.csid, 3, 2, '');
        return this.cs.callEdge(ei, arguments, [
            [this.cs.inParm(1, '', 0, 0, '')]
        ]);
    }
    ToArray() {
        let ei = this.cs.edgeIn('ToArray', this.csid, 3, 1, '');
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