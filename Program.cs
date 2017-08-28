using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

using System.Diagnostics;
using System.Configuration;
using System.Xml;

using System.Reflection;
using System.Reflection.Emit;
using System.Globalization;

using System.Text.RegularExpressions;
using System.Security.Permissions;

namespace Sheath
{

    class Program
    {

        public static List<string> Classes = new List<string>();

        public static List<string> Enums = new List<string>();

        public static string LibPath = null;
        public static bool ExportXml = false;

        public static string jsObj = "class csObj{constructor(cs,args){this.cs=cs;this.name='CLASSNAME';this.assembly='ASSEMBLY';this.file='FILE';this.type=TYPE;this.csid=0;if (args.length==2){if(args[0]=='csid'){this.csid = args[1];return;}}let ei = this.cs.edgeIn(this.name,0,1,6,'','',this.assembly,this.file);let ctors=CTORS;this.csid=this.cs.callEdge(ei,args,ctors);}release(){let ei=this.cs.edgeIn('',this.csid,4);this.cs.sheath(ei);}";

        static void Main(string[] args)
        {
  
            if (args.Length == 2)
            {
                LibPath = args[1];
            }
            else
            {
                LibPath = ConfigurationManager.AppSettings["libPath"];
            }

            if (String.IsNullOrEmpty(LibPath))
            {
                LibPath = AppDomain.CurrentDomain.BaseDirectory;
            }
            
            if (!System.IO.Directory.Exists(LibPath))
            {
                throw new System.InvalidOperationException("Library Path Does Not Exist");
            }

            LibPath = LibPath.Replace("\\", "/");

            ExportXml = ConfigurationManager.AppSettings["ExportXml"] == "1";
           
            

            if (!LibPath.EndsWith("/")) LibPath += "/";

            if (!Directory.Exists(LibPath))
            {
                Directory.CreateDirectory(LibPath);
            }

            if (!Directory.Exists(LibPath + "lib/xml"))
            {
                Directory.CreateDirectory(LibPath + "lib/xml");
            }

            if (!Directory.Exists(LibPath + "lib/xml/objs"))
            {
                Directory.CreateDirectory(LibPath + "lib/xml/objs");
            }

            if (!Directory.Exists(LibPath + "lib/xml/enums"))
            {
                Directory.CreateDirectory(LibPath + "lib/xml/enums");
            }

            if (!Directory.Exists(LibPath + "lib/js"))
            {
                Directory.CreateDirectory(LibPath + "lib/js");
            }

            if (!Directory.Exists(LibPath + "lib/js/objs"))
            {
                Directory.CreateDirectory(LibPath + "lib/js/objs");
            }

            if (!Directory.Exists(LibPath + "lib/js/enums"))
            {
                Directory.CreateDirectory(LibPath + "lib/js/enums");
            }

            string AssemblyName = args[0];
            
            Assembly assembly = null;

            try
            {
                if (AssemblyName.ToLower().EndsWith(".dll"))
                {
                    assembly = Assembly.Load(AssemblyName);
                }
                else {
                    
                    foreach(var ass in AppDomain.CurrentDomain.GetAssemblies())
                    {
                        if (ass.FullName.StartsWith(AssemblyName))
                        {
                            assembly = ass;
                        }
                    }

                    if (assembly == null)
                    {
                        assembly = Assembly.Load(AssemblyName);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new System.InvalidOperationException(ex.Message);
            }

            var Runner = new Runner();

//            Runner.TestSheath();

            foreach (var o in assembly.GetExportedTypes())
            {
                Runner.MapObj(o);
            }

        }
        
        public class Runner
        {
            private static System.Threading.Mutex mut = new System.Threading.Mutex();

            async public void TestSheath()
            {
                //    var x = new System.Data.SqlClient.SqlConnection("Data Source=localhost,1433;Network Library=DBMSSOCN;Initial Catalog=sweet16;User ID=guest;Password=guest;");
                //   x.Open();

                


                var st = new Startup();

                EdgeIn cInput = new EdgeIn();

                cInput.csid = -404;
                cInput.name = "queue";
                cInput.assembly = "string|";
                cInput.file = "string|";
                cInput.act = 1;
                cInput.ret.type = 2;


                string sqlc = "Data Source=localhost,1433;Network Library=DBMSSOCN;Initial Catalog=sweet16;User ID=guest;Password=guest;";
                cInput.parms = new parm[1];
                cInput.parms[0] = new parm(1, sqlc);


                EdgeOut eo = (EdgeOut)await st.Invoke(cInput);

                //EdgeIn cInput = new EdgeIn();

                //cInput.csid = 0;
                //cInput.name = "System.Data.SqlClient.SqlConnection";
                //cInput.assembly = "System.Data, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089";
                //cInput.file = @"C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.6.1\System.Data.dll";
                //cInput.act = 1;
                //cInput.ret.type = -1;


                //string sqlc = "Data Source=localhost,1433;Network Library=DBMSSOCN;Initial Catalog=sweet16;User ID=guest;Password=guest;";
                //cInput.parms = new parm[1];
                //cInput.parms[0] = new parm(1, sqlc);


                //EdgeOut eo = (EdgeOut) await st.Invoke(cInput);

                cInput.csid = eo.retval;
                cInput.name = "Open";
                cInput.act = 3;
                cInput.parms = new parm[0];

                var ex = await st.Invoke(cInput);

            }

            public void MapObj(Type o)
            {
                
               bool isArray = false, isByRef = false;

               string ShortName = FixName(o, ref isArray, ref isByRef);
               if (Enums.Contains(ShortName))
                {
                    return;  
                }

                Console.WriteLine(ShortName);
                Enums.Add(ShortName);
                
                XmlDocument CDOC = new XmlDocument();

                string title = "class";
                if (o.IsValueType) { title = "struct"; }
                if (o.IsInterface) { title = "interface"; }

                var x1 = NewNode(CDOC, title, FixName(o, ref isArray, ref isByRef));

                AddAttribute(x1, "fullName", o.FullName);
                AddAttribute(x1, "assembly", o.Assembly.FullName);
                AddAttribute(x1, "location", o.Assembly.Location);
                IdType(o, x1);

                if (o.GetConstructor(Type.EmptyTypes) == null && o.IsAbstract && o.IsSealed)
                {
                    AddAttribute(x1, "static", "1");
                }

                x1.AppendChild(CDOC.CreateElement("interfaces"));
                x1.AppendChild(CDOC.CreateElement("constructors"));
                x1.AppendChild(CDOC.CreateElement("fields"));
                x1.AppendChild(CDOC.CreateElement("props"));
                var xMethods = (CDOC.CreateElement("methods"));

                x1.AppendChild(xMethods);

                CDOC.AppendChild(x1);

                foreach (var i in o.GetInterfaces())
                {
                    var Name = (i.FullName == null ? i.Name : i.FullName);

                    if (Name != null)
                    {
                        bool dum = false;
                        var x2 = NewNode(CDOC, "interface", FixName(i, ref dum, ref dum));
                        Type iT = i.GetType();
                        MapObj(i);

                        x1.SelectSingleNode("interfaces").AppendChild(x2);
                    }
                }

   
                foreach (var mi in o.GetConstructors())
                {

                    var x2 = (XmlElement)CDOC.CreateElement("constructor");


                    foreach (var pi in mi.GetParameters())
                    {
                        var x3 = NewNode(CDOC, "param", pi.Name);

                        IdType(pi.ParameterType, x3);
                        x2.AppendChild(x3);

                    }

                    x1.SelectSingleNode("constructors").AppendChild(x2);


                }

                var pnames = new List<string>();

                foreach (FieldInfo fi in o.GetFields())
                {
                    pnames.Add(fi.Name);

                    var f = NewNode(CDOC, "field", fi.Name);

                    AddAttribute(f, "value");

                    Type t = fi.FieldType;
                    IdType(t, f);

                    int iType = Convert.ToInt32(f.GetAttribute("type"));


                    x1.SelectSingleNode("fields").AppendChild(f);
                }

                foreach (PropertyInfo pi in o.GetProperties())
                {
            
                    //necessary because adds prop twice if read/write
                    if (!pnames.Contains(pi.Name))
                    {
                        var p = NewNode(CDOC, "prop", pi.Name);

                        var list = pi.GetIndexParameters();
                        if (list.Length > 0)
                        {
                            AddAttribute(p, "index", GetDataType(list[0].ParameterType).ToString());
                        }
                        AddAttribute(p, "value");
                        AddAttribute(p, "read", pi.CanRead ? "1" : "0");
                        AddAttribute(p, "write", pi.CanWrite ? "1" : "0");

                        Type t = pi.PropertyType;
                        IdType(t, p);

                        x1.SelectSingleNode("props").AppendChild(p);
                        pnames.Add(pi.Name);
                        x1.SelectSingleNode("props").AppendChild(p);

                    }
                }

                int staticMethods = 0;
                int totalMethods = 0;

                if (o.IsInterface)
                {
                    int i = 0;
                }
                foreach (var mi in o.GetMethods())
                {

                    if (mi.Name.StartsWith("get_") || mi.Name.StartsWith("set_")) continue;
                    if (mi.Name == "GetType") continue;
                    
                    totalMethods++;
                    
                    XmlElement x2 = null;
                    XmlElement x3 = null;

                    foreach (XmlElement x2a in xMethods.SelectNodes("method"))
                    {
                        if (x2a.GetAttribute("name") == mi.Name)
                        {
                            x2 = x2a; break;
                        }
                    }

                    if (x2 == null)
                    {
                        x2 = NewNode(CDOC, "method", mi.Name);
                        xMethods.AppendChild(x2);

                        x3 = CDOC.CreateElement("overloads");
                        x2.AppendChild(x3);

                        Type t = mi.ReturnType;

                        IdType(t, x2);
                        int iType = Convert.ToInt32(x2.GetAttribute("type"));

                    }
                    else
                    {
                        x3 = (XmlElement)x2.SelectSingleNode("overloads");
                    }

                    if (mi.IsStatic)
                    {
                        staticMethods++;
                        AddAttribute(x2, "static", "1");
                    }

                    var x4 = CDOC.CreateElement("params");

                    foreach (var pi in mi.GetParameters())
                    {
                        Type t = pi.ParameterType;
                        var x5 = NewNode(CDOC, "param", pi.Name);
                        IdType(t, x5);
                        x4.AppendChild(x5);
                    }

                    bool dupe = false;
                    foreach (XmlElement nowParms in x3.ChildNodes)
                    {
                        dupe = (nowParms.InnerXml == x4.InnerXml);
                        if (dupe) break;
                    }

                    if (!dupe) x3.AppendChild(x4);

                }

               

                if (totalMethods == staticMethods && totalMethods != 0)
                {  // this should be good cuz can't have non static methods in a static class
                    AddAttribute(x1, "static", "1");
                }

                if (ShortName == "System.Data.SqlClient.SqlCommand") {
                    Debug.Print("bam");
                };

                Write(CDOC);
               
            }

            public void Write(XmlDocument CDOC)
            {
                XmlElement x1 = (XmlElement)CDOC.FirstChild;
                string ShortName = x1.GetAttribute("name");
                if (ShortName == "System.Data.SqlDbType")
                {
                    int ix = 0;
                }

                try
                {
                    if (ExportXml) CDOC.Save(LibPath + "lib/xml/objs/" + ShortName + ".xml");
                    WriteJS(CDOC);
                }catch(Exception ex)
                {
                    Console.WriteLine("Bad Name :" + ShortName);
                }
            }

            public void WriteJS(XmlDocument CDOC)
            {
                XmlElement fc = (XmlElement)CDOC.FirstChild;
                if (fc.GetAttribute("name") == "System.Data.SqlClient.SqlCommand")
                {
                    int x = 1;
                }
                XmlElement x1 = (XmlElement)CDOC.FirstChild;
                string js = jsObj;
                string ShortName = x1.GetAttribute("name");
                string FullName = x1.GetAttribute("fullName");
                if (FullName == "") FullName = ShortName;
                js = js.Replace("CLASSNAME", FullName);
                js = js.Replace("ASSEMBLY", x1.GetAttribute("assembly"));
                js = js.Replace("TYPE", x1.GetAttribute("type"));
                string loc = x1.GetAttribute("location");
                loc = loc.Replace(@"\", "/");
                js = js.Replace("FILE", loc);
                
                var xCtors = x1.SelectSingleNode("constructors");
                var xFields = x1.SelectSingleNode("fields");
                var xProps = x1.SelectSingleNode("props");
                var xMethods = x1.SelectSingleNode("methods");
                
                string allCtors = "[";
                
                foreach (XmlElement mi in xCtors)
                {
                    
                    string sParms = "";

                    foreach (XmlElement x3 in mi.ChildNodes)
                    {

                        sParms += FormatJsParm(x3) + ',';
              
                    }

                    if (sParms.Length > 0)
                    {
                        sParms = "[" + sParms;
                        sParms = sParms.TrimEnd(","[0]);
                        sParms += "],";
                    }

                    allCtors += sParms;

                
                }

                if (allCtors.EndsWith(",")) allCtors = allCtors.TrimEnd(","[0]);
                allCtors += "]";
                js = js.Replace("CTORS", allCtors);
                foreach (XmlElement f in xFields)
                {

                    string name = f.GetAttribute("name");
                    string sParm = FormatJsParm(f);
                    int iType = Convert.ToInt32(f.GetAttribute("type"));
                    js += "set " + name + "(val){let ei=this.cs.edgeIn('" + name + "',this.csid,3,0);";
                    js += "this.cs.callEdge(ei,[val],[[" + sParm + ")]]);}";

                    js += "get " + name + "(){let ei=this.cs.edgeIn('" + name + "',this.csid,2,";
                    js += iType + ",'";
                    js += (iType < 0 ? f.GetAttribute("obj") : "") + "','";
                    string elist = f.GetAttribute("enum");
                    js += (elist == null ? f.GetAttribute("enum") : "");
                    js += "');return this.cs.callEdge(ei,[[]],[]);}";

                    x1.SelectSingleNode("fields").AppendChild(f);
                }

                foreach (XmlElement pi in xProps)
                {
                    //necessary because adds prop twice if read/write


                    string sParm = FormatJsParm(pi);
                    string name = pi.GetAttribute("name");
                    bool CanWrite = pi.GetAttribute("write") == "1";
                    bool CanRead = pi.GetAttribute("read") == "1";
                    string Index = pi.GetAttribute("index");
                    if (Index == "")
                    {
                        if (CanWrite)
                        {
                            js += "set " + name + "(val){let ei=this.cs.edgeIn('" + name + "',this.csid,3,0);";
                            js += "this.cs.callEdge(ei,[val],[[" + sParm + "]]);}";
                        }

                        if (CanRead)
                        {
                            int iType = Convert.ToInt32(pi.GetAttribute("type"));
                            js += "get " + name + "(){let ei=this.cs.edgeIn('" + name + "',this.csid,2,";
                            js += iType + ",'";
                            js += (iType < 0 ? pi.GetAttribute("obj") : "") + "','";
                            string elist = pi.GetAttribute("enum");
                            js += (elist == null ? pi.GetAttribute("enum") : "");
                            js += "');return this.cs.callEdge(ei,[[]],[]);}";
                        }
                    }
                    else
                    {

                        int iType = Convert.ToInt32(pi.GetAttribute("type"));
                        js += name + "(index";
                        js += CanWrite ? ",val){" : "){";
                        js += "let canWrite=" + (CanWrite ? "true" : "false") + ";";

                        js += "let ei=this.cs.edgeIn('" + name + "',this.csid);";
                        js += "ei.index = index;";
                        js += "ei.act = (canWrite && val != undefined && val != null )?3:2;";
                        if (CanWrite) {
                            js += "if (canWrite && ei.act==3){";
                            js += "return this.cs.callEdge(ei,[val],[[" + sParm + "]]);}";
             
                        }
                        js += "if (ei.act==2){ei.ret.type = " + iType + ";";
                        js += "ei.ret.jsObj = '" + pi.GetAttribute("obj") + "';";
                        js += "return this.cs.callEdge(ei,[[]],[]);}";
                        js += "}";

                    }
                    
                }
                
                foreach (XmlElement meth in xMethods.ChildNodes)
                {
                    string jsMethod = "";

                    int iType = 0;

                    iType = Convert.ToInt32(meth.GetAttribute("type"));
                    string name = meth.GetAttribute("name");

                    jsMethod = name + "(){let ei=this.cs.edgeIn('" + name + "',this.csid,3,";
                    jsMethod += iType + ",'";
                    jsMethod += (iType < 0 ? meth.GetAttribute("obj") : "") + "')";

                    string jsCtors = "";

                    foreach (XmlElement ol in meth.SelectSingleNode("overloads").ChildNodes)
                    {
                        string mParms = "";

                        foreach (XmlElement parm in ol)
                        {
                            mParms += FormatJsParm(parm) + ",";
                        }

                        mParms = "[" + mParms.TrimEnd(","[0]) + "],";
                        jsCtors += mParms;

                    }

                    jsCtors = jsCtors.TrimEnd(","[0]);
                    jsMethod += ";" + (iType == 0 ? "" : "return ") + "this.cs.callEdge(ei,arguments,[" + jsCtors + "]);}";
                    js += jsMethod;

                }
                
                try
                {
                    js += "}module.exports = csObj; ";
                    System.IO.File.WriteAllText(LibPath + "lib/js/objs/" + ShortName + ".js", js);
                    //go through constructors
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.Message);
                }

            
            }

            public string FormatJsParm(XmlElement xParm)
            {
                int iType = Convert.ToInt32(xParm.GetAttribute("type"));

                string sParm = "this.cs.inParm(" + iType + ",'";
                sParm += (iType < 0 ?  xParm.GetAttribute("obj")  :"") + "',";
                sParm += xParm.HasAttribute("ref") ? "1," : "0,";
                sParm += xParm.HasAttribute("array") ? xParm.GetAttribute("array") : "0";
                
                sParm += ",'" + (xParm.HasAttribute("enum") ?  xParm.GetAttribute("enum") : "");
                sParm += "')";

                return sParm;

            }

            public void MapEnum(Type e)
            {
                if (Classes.Contains(e.FullName)) return;
                Classes.Add(e.FullName);

                XmlDocument CDOC = new XmlDocument();
                string title = "enum";
                var x1 = NewNode(CDOC, title, e.Name);

                AddAttribute(x1, "fullName", e.FullName);
                AddAttribute(x1, "assembly", e.Assembly.FullName);
                AddAttribute(x1, "location", e.Assembly.Location);

                CDOC.AppendChild(x1);

                Type et = e.GetEnumUnderlyingType();
                int enumType = GetDataType(et);

                AddAttribute(x1, "type", enumType.ToString());

                string jsEnum = "class jenum{constructor(){";
                string jsEnumBody = "";
                jsEnum += "this.val=null;this.type=" + enumType + ";";
                jsEnum += "this.els =[";

                string[] names = e.GetEnumNames();
                int i = 0;
                foreach (var val in e.GetEnumValues())
                {
                    string v1 = "";
                    try
                    { 
                         v1 = Convert.ChangeType(val, et).ToString();
                    }catch(Exception ex)
                    {
                        Console.WriteLine("enum bomb " +val.ToString());
                    }
                    //string v1 = Convert.ToString(val);
                    var line = NewNode(CDOC, title, names[i]);
                    if (v1 == names[i]) v1 = i.ToString();
                    AddAttribute(line, "value", v1);
                    if (enumType == 1) { v1 = "'" + val + "';"; };
                    jsEnum += v1 + ",";
                    jsEnumBody += "get " + names[i] +  "(){return this.els["+i+"];}";
                    x1.AppendChild(line);
                    i++;
                }

                jsEnum = jsEnum.TrimEnd(","[0]);
                jsEnum += "];}" + jsEnumBody;
                jsEnum += "set value(inval){for(let i=0;i<this.els.length;i++){if (els[i]==inval){ this.val=inval;break;}}}get value(){return this.val;}";
                jsEnum += "}module.exports = jenum; ";

                if (e.FullName == "System.Data.SqlDbType")
                {
                    int ix =0;
                }
                System.IO.File.WriteAllText(LibPath + "lib/js/enums/" + e.FullName + ".js", jsEnum);
                
                if (ExportXml) CDOC.Save(LibPath    + "lib/xml/enums/" + e.FullName + ".xml");

            }

            public XmlElement NewNode(XmlDocument doc, string elType, string Name)
            {
                XmlElement xl = doc.CreateElement(elType);

                xl.SetAttributeNode("name", "");
                xl.SetAttribute("name", Name);

                return xl;
            }

            public void AddAttribute(XmlElement xmlE, string AttName, string Value = "")
            {
                xmlE.SetAttributeNode(AttName, "");
                xmlE.SetAttribute(AttName, Value);
            }

            public string FixName(Type InType, ref bool IsArray, ref bool IsByRef)
            {

                string TypeName = InType.FullName;

                if (TypeName == null)
                {
                    TypeName = InType.Name;
                }
                else
                {
                    System.Text.RegularExpressions.Regex rex;
                    System.Text.RegularExpressions.Match hits;

                    rex = new Regex(@"(.*)(\[\[).*");
                    hits = rex.Match(TypeName);
                    if (hits.Groups.Count == 3)
                    {
                        TypeName = hits.Groups[1].Value;
                        hits = rex.Match(TypeName);
                        if (hits.Groups.Count == 2)
                        {
                            TypeName = hits.Groups[1].Value;
                        }
                    }
                }

                if (TypeName.EndsWith("&"))
                {
                    TypeName = TypeName.TrimEnd("&"[0]);
                    IsByRef = true;
                }
                if (TypeName.Contains("[]"))
                {
                    TypeName = TypeName.Replace("[]", "");
                    IsArray = true;
                }
                if (TypeName.EndsWith("&amp;"))
                {
                    TypeName = TypeName.Replace("&amp;", "");
                    IsByRef = true;
                }

                return TypeName;
            }

            public void IdType(Type t, XmlElement xmlEl)
            {

                System.Text.RegularExpressions.Regex rex;
                System.Text.RegularExpressions.Match hits;
                string strType = "";
                Type retType = null;

                int DataType = GetDataType(t);

                bool isArray = false, isByRef = false;
                string TypeName = FixName(t, ref isArray, ref isByRef);

                if (DataType > 2000)
                {
                    AddAttribute(xmlEl, "array", "1");
                    DataType -= 2000;
                }
                if (DataType > 1000)
                {
                    DataType -= 1000;
                    AddAttribute(xmlEl, "ref", "1");
                }

              
                AddAttribute(xmlEl, "type", DataType.ToString());
                if (DataType < 0){
                    switch (DataType)
                    {
                        case -1:
                            AddAttribute(xmlEl, "objType", "class");
                            MapObj(t);
                            break;
                        case -2:
                            AddAttribute(xmlEl, "objType", "struct");
                            MapObj(t);
                            break;
                        case -3:
                            AddAttribute(xmlEl, "objType", "interface");
                            MapObj(t);
                            break;
                        case -4:  //enum
                            xmlEl.SetAttribute("objType", "enum");
                            xmlEl.SetAttribute("type", GetDataType(t.GetEnumUnderlyingType()).ToString());
                            MapEnum(t);
                            break;
                        case -5:
                            AddAttribute(xmlEl, "objType", "abstract");
                            MapObj(t);
                            break;
                        case -8:
                            AddAttribute(xmlEl, "array", "3");
                            AddAttribute(xmlEl, "keyType", "");

                            rex = new Regex(@"\[\[(.+)\],\[(.+)\]\]");
                            hits = rex.Match(t.FullName);

                            if (hits.Groups.Count == 3)
                            {
                                strType = hits.Groups[1].Value;

                                retType = GetTypeFromTypeName(strType);
                                int myTID = GetDataType(retType);
                                AddAttribute(xmlEl, "keyType", myTID.ToString());

                                strType = hits.Groups[2].Value;
                                retType = GetTypeFromTypeName(strType);
                                xmlEl.RemoveAttribute("type");
                                IdType(retType, xmlEl);

                            };

                            break;
                        case -9:
                            AddAttribute(xmlEl, "array", "2");

                            rex = new Regex(@"\[\[(.+)\]\]");
                            hits = rex.Match(t.FullName);
                            strType = hits.Groups[1].Value;
                            hits = rex.Match(strType);
                            if (hits.Groups.Count == 2)
                            {
                                strType = hits.Groups[1].Value;

                                retType = GetTypeFromTypeName(strType);
                                xmlEl.RemoveAttribute("type");
                                IdType(retType, xmlEl);
                            }

                            break;
                        default:
                            MapObj(t);
                            break;
                    }

                }

                AddAttribute(xmlEl, "obj", TypeName);

            }

            public Type GetTypeFromTypeName(string el)
            {

                int pos = el.IndexOf(","[0]);

                string typeName = el.Substring(0, pos);
                string assName = el.Substring(pos + 1);

                return GetTypeFromTypeName(typeName, assName);

            }

            public static Type GetTypeFromTypeName(string typeName, string assName)
            {

                foreach (Assembly ai in AppDomain.CurrentDomain.GetAssemblies())
                {
                    if (ai.FullName == assName)
                    {
                        foreach (Type T in ai.GetTypes())
                        {
                            if (T.FullName == typeName)
                            {
                                return T;
                            }
                        }

                    }

                }

                try {

                    Assembly assembly = Assembly.Load(assName);

                    foreach (Type T in assembly.GetTypes())
                    {
                        if (T.FullName == typeName)
                        {
                            return T;
                        }
                    }

                }catch(Exception ex)
                {

                }

                return null;
            }

            public int GetDataType(Type t)
            {

                int T = -911;
                bool isByRef = false;
                bool isArray = false;

                string ShortName = FixName(t, ref isArray, ref isByRef);

                switch (ShortName)
                {
                    case null:
                    case "System.Void":
                        T = 0;
                        break;
                    case "System.String":
                        T = 1;
                        break;
                    case "System.Boolean":
                        T = 2;
                        break;
                    case "System.DateTime":
                        T = 3;
                        break;
                    case "System.Int32":
                        T = 4;
                        break;
                    case "System.Double":
                        T = 5;
                        break;
                    case "System.UInt32":
                        T = 6;
                        break;
                    case "System.Int64":
                        T = 7;
                        break;
                    case "System.UInt64":
                        T = 8;
                        break;
                    case "System.Single":
                        T = 9;
                        break;
                    case "System.Int16":
                        T = 10;
                        break;
                    case "System.UInt16":
                        T = 11;
                        break;
                    case "System.Decimal":
                        T = 12;
                        break;
                    case "System.Byte":
                        T = 13;
                        break;
                    case "System.SByte":
                        T = 14;
                        break;
                    case "System.Char":
                        T = 15;
                        break;
                    case "System.Object":
                        T = 16;
                        break;
                    case "System.Type":
                        T = -7;
                        break;
                    case "System.Collections.Generic.Dictionary`2":
                    case "System.Collections.Generic.Dictionary`2+ValueCollection":
                    case "System.Collections.Generic.Dictionary`2+KeyCollection":
                    case "System.Collections.Generic.KeyValuePair`2":
                        T = -8;
                        break;
                    case "System.Collections.Generic.List`1":
                    case "System.Collections.ObjectModel.ReadOnlyCollection`1":
                        T = -9;
                        break;
                    case "System.Guid":
                        T = -10;
                        break;
                    case "System.IntPtr":
                        T = -11;
                        break;
                    
                    default:
                        if (t.IsGenericParameter || t.IsGenericType || t.IsGenericTypeDefinition)
                        {
                            T = -12;
                        }
                        else if (t.IsEnum)
                        {
                            T = -4;
                        }
                        else if (t.IsValueType)
                        {
                            T = -2;
                        }
                        else if (t.IsInterface)
                        {
                            T = -3;
                        }
                        else if (t.IsAbstract)
                        {
                            T = -5;
                        }
                        else if (t.IsClass)
                        {
                            T = -1;
                        }

                        if (t.IsArray)
                        {
                            isArray = true;
                        }
                        break;

                }


                if (T == -911)
                {
       //             Debug.WriteLine(ShortName + " " + t.FullName);
                }

                if (T != -1 && T != 0)
                {
                    if (isArray)
                    {
                        T += 2000;
                    }
                    if (isByRef)
                    {
                        T += 1000;
                    }
                }

                return T;
            }

        }
    }
}
