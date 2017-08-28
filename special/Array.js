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

  constructor(cs, args) {
      
    this.cs = cs;
    this.name = 'System.Array';
    this.assembly = 'mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089';
    this.file = 'C:/Windows/Microsoft.NET/Framework64/v4.0.30319/mscorlib.dll';
    this.type = -5;
    this.csid = 0;
    if (args.length == 2) {
      if (args[0] == 'csid') {
        this.csid = args[1];
        return;
      }
    }
 
    let ei = this.cs.edgeIn(this.name, 0, 1, 6, '', '', this.assembly, this.file);
    let ctors = [];
    this.csid = this.cs.callEdge(ei, args, ctors);
  }
  release() {
    let ei = this.cs.edgeIn('', this.csid, 4);
    this.cs.sheath(ei);
  }
  get Length() {
    let ei = this.cs.edgeIn('Length', this.csid, 2, 4, '', '');
    return this.cs.callEdge(ei, [
      []
    ], []);
  }
  get LongLength() {
    let ei = this.cs.edgeIn('LongLength', this.csid, 2, 7, '', '');
    return this.cs.callEdge(ei, [
      []
    ], []);
  }
  get Rank() {
    let ei = this.cs.edgeIn('Rank', this.csid, 2, 4, '', '');
    return this.cs.callEdge(ei, [
      []
    ], []);
  }
  get SyncRoot() {
    let ei = this.cs.edgeIn('SyncRoot', this.csid, 2, 16, '', '');
    return this.cs.callEdge(ei, [
      []
    ], []);
  }
  get IsReadOnly() {
    let ei = this.cs.edgeIn('IsReadOnly', this.csid, 2, 2, '', '');
    return this.cs.callEdge(ei, [
      []
    ], []);
  }
  get IsFixedSize() {
    let ei = this.cs.edgeIn('IsFixedSize', this.csid, 2, 2, '', '');
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
  AsReadOnly() {
    let ei = this.cs.edgeIn('AsReadOnly', this.csid, 3, -12, 'ReadOnlyCollection`1');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, '')]
    ]);
  }
  Resize() {
    let ei = this.cs.edgeIn('Resize', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  CreateInstance() {
    let ei = this.cs.edgeIn('CreateInstance', this.csid, 3, -5, 'System.Array');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(4, '', 0, 1, '')],
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(7, '', 0, 1, '')],
      [this.cs.inParm(-7, 'System.Type', 0, 0, ''), this.cs.inParm(4, '', 0, 1, ''), this.cs.inParm(4, '', 0, 1, '')]
    ]);
  }
  Copy() {
    let ei = this.cs.edgeIn('Copy', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')]
    ]);
  }
  ConstrainedCopy() {
    let ei = this.cs.edgeIn('ConstrainedCopy', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  Clear() {
    let ei = this.cs.edgeIn('Clear', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  GetValue() {
    let ei = this.cs.edgeIn('GetValue', this.csid, 3, 16, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(4, '', 0, 1, '')],
      [this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(7, '', 0, 1, '')]
    ]);
  }
  SetValue() {
    let ei = this.cs.edgeIn('SetValue', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 1, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')],
      [this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(7, '', 0, 1, '')]
    ]);
  }
  GetLength() {
    let ei = this.cs.edgeIn('GetLength', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  GetLongLength() {
    let ei = this.cs.edgeIn('GetLongLength', this.csid, 3, 7, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  GetUpperBound() {
    let ei = this.cs.edgeIn('GetUpperBound', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  GetLowerBound() {
    let ei = this.cs.edgeIn('GetLowerBound', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  Clone() {
    let ei = this.cs.edgeIn('Clone', this.csid, 3, 16, '');
    return this.cs.callEdge(ei, arguments, [
      []
    ]);
  }
  BinarySearch() {
    let ei = this.cs.edgeIn('BinarySearch', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(16, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')]
    ]);
  }
  ConvertAll() {
    let ei = this.cs.edgeIn('ConvertAll', this.csid, 3, -1, 'TOutput');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'TInput', 0, 0, ''), this.cs.inParm(-12, 'Converter`2', 0, 0, '')]
    ]);
  }
  CopyTo() {
    let ei = this.cs.edgeIn('CopyTo', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(7, '', 0, 0, '')]
    ]);
  }
  Empty() {
    let ei = this.cs.edgeIn('Empty', this.csid, 3, -1, 'T');
    return this.cs.callEdge(ei, arguments, [
      []
    ]);
  }
  Exists() {
    let ei = this.cs.edgeIn('Exists', this.csid, 3, 2, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  Find() {
    let ei = this.cs.edgeIn('Find', this.csid, 3, -12, 'T');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  FindAll() {
    let ei = this.cs.edgeIn('FindAll', this.csid, 3, -1, 'T');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  FindIndex() {
    let ei = this.cs.edgeIn('FindIndex', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  FindLast() {
    let ei = this.cs.edgeIn('FindLast', this.csid, 3, -12, 'T');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  FindLastIndex() {
    let ei = this.cs.edgeIn('FindLastIndex', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  ForEach() {
    let ei = this.cs.edgeIn('ForEach', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Action`1', 0, 0, '')]
    ]);
  }
  GetEnumerator() {
    let ei = this.cs.edgeIn('GetEnumerator', this.csid, 3, -3, 'System.Collections.IEnumerator');
    return this.cs.callEdge(ei, arguments, [
      []
    ]);
  }
  IndexOf() {
    let ei = this.cs.edgeIn('IndexOf', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  LastIndexOf() {
    let ei = this.cs.edgeIn('LastIndexOf', this.csid, 3, 4, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(16, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  Reverse() {
    let ei = this.cs.edgeIn('Reverse', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')]
    ]);
  }
  Sort() {
    let ei = this.cs.edgeIn('Sort', this.csid, 3, 0, '');
    this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-5, 'System.Array', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(-5, 'System.Array', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-3, 'System.Collections.IComparer', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, '')],
      [this.cs.inParm(-1, 'TKey', 0, 0, ''), this.cs.inParm(-1, 'TValue', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'TKey', 0, 0, ''), this.cs.inParm(-1, 'TValue', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')],
      [this.cs.inParm(-1, 'TKey', 0, 0, ''), this.cs.inParm(-1, 'TValue', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')],
      [this.cs.inParm(-1, 'TKey', 0, 0, ''), this.cs.inParm(-1, 'TValue', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(4, '', 0, 0, ''), this.cs.inParm(-12, 'IComparer`1', 0, 0, '')],
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Comparison`1', 0, 0, '')]
    ]);
  }
  TrueForAll() {
    let ei = this.cs.edgeIn('TrueForAll', this.csid, 3, 2, '');
    return this.cs.callEdge(ei, arguments, [
      [this.cs.inParm(-1, 'T', 0, 0, ''), this.cs.inParm(-12, 'Predicate`1', 0, 0, '')]
    ]);
  }
  Initialize() {
    let ei = this.cs.edgeIn('Initialize', this.csid, 3, 0, '');
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
      [this.cs.inParm(16, '', 0, 0, '')]
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
