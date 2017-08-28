using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using System.Diagnostics;

public class Startup
{

    public async Task<object> Invoke(dynamic input)
    {
        EdgeIn jIn = new EdgeIn();

        jIn.csid = (int)input.csid;
        jIn.name = (string)input.name;
        jIn.assembly = (string)input.assembly;
        jIn.file = (string)input.file;
        jIn.act = (int)input.act;
        jIn.index = input.index;
        jIn.ret.type = (int)input.ret.type;

        int pl = input.parms.Length;

        if (pl > 0)
        {
            jIn.parms = new parm[pl];
            for (int i = 0; i < pl; i++)
            {
                jIn.parms[i] = new parm(
                    (int)input.parms[i].type,
                    input.parms[i].value);
            }
        }

        return Runner.Relay(jIn);

    }
}

public class EdgeIn
{
    public int csid = 0;
    public string name = "";
    public string assembly = "";
    public string file = "";
    public int act = 0;
    public dynamic index = null;
    public parm ret = new parm();
    public parm[] parms = new parm[0];

    public bool IsStatic = false;

}

public class parm
{
    public parm() { }

    public parm(int type, dynamic value)
    {
        this.type = type;
        this.value = value;
    }

    public int type = 0;
    public dynamic value;
}

public class EdgeOut
{
    public dynamic retval;
    public string errmsg = "";
    public dynamic[] parms = new dynamic[0];
}

public class classy
{
    public classy(dynamic obj)
    {
        o = obj;
    }
    public dynamic o;
    public List<int> csids = new List<int>();
}

static class Runner
{

    public static int NextCsID = 0;

    public static Dictionary<int, classy> Cache = new Dictionary<int, classy>();


    public static EdgeOut Relay(EdgeIn jIn)
    {

        var jOut = new EdgeOut();
        if (jIn.parms.Length > 0)
        {
            jOut.parms = new dynamic[jIn.parms.Length];
        }

        dynamic o = null;
        Type T = null;

        //create or return csid
        CreateGetObj(jIn, jOut, ref T, ref o);

        switch (jIn.act)
        {
            case 2:     //read fields or properties
            case 3:     //update 
                DoMethod(o, T, jIn, jOut);
                break;
            case 4:     //delete
                release(jIn.csid);
                break;
            default:
                break;
        }

        return jOut;
    }

    public static void CreateGetObj(EdgeIn jIn, EdgeOut jOut, ref Type T, ref dynamic o)
    {

        int ii = 0;
        o = null;
        try
        {
            if (jIn.csid == -404)
            {
                Type[] parms = new Type[1];
                Type g = null;

                int typeIdKey = 0;
                int typeIdValue = 0;

                switch (jIn.name)
                {
                    case ("array"):
                        Type t = GetTypeFromTypeName(jIn.name, jIn.assembly);
                        o = Array.CreateInstance(t, jIn.index);
                        break;
                    case ("dictionary"):
                        parms = new Type[2];
                        parms[0] = GetGenericType(jIn.assembly,ref typeIdKey);
                        parms[1] = GetGenericType(jIn.file ,ref typeIdValue);
                        g = typeof(Dictionary<,>);
                        break;
                    case ("sorteddictionary"):
                        parms = new Type[2];
                        parms[0] = GetGenericType(jIn.assembly,ref typeIdKey);
                        parms[1] = GetGenericType(jIn.file, ref typeIdValue);
                        g = typeof(SortedDictionary<,>);
                        break;
                    case ("list"):
                        parms[0] = GetGenericType(jIn.assembly, ref typeIdValue);
                        g = typeof(List<>);
                        break;
                    case ("linkedlist"):
                        parms[0] = GetGenericType(jIn.assembly, ref typeIdValue);
                        g = typeof(LinkedList<>);
                        break;
                    case ("stack"):
                        parms[0] = GetGenericType(jIn.assembly, ref typeIdValue);
                        g = typeof(Stack<>);
                        break;
                    case ("queue"):
                        parms[0] = GetGenericType(jIn.assembly, ref typeIdValue);
                        g = typeof(Queue<>);
                        break;
                }

                if (jIn.name != "array")
                {
                s    Type constructed = g.MakeGenericType(parms);
                    o = Activator.CreateInstance(constructed);
                }

                NextCsID++;
                Cache.Add(NextCsID, new classy(o));
                jOut.retval = NextCsID;
                jOut.parms = new parm[1];
                jOut.parms[0] = new parm( typeIdKey, typeIdValue);

                return;

            }

            if (jIn.csid != 0)
            {
                o = Cache[jIn.csid].o;
                T = o.GetType();
                return;
            }

            var isLoaded = false;
            foreach (var ass in AppDomain.CurrentDomain.GetAssemblies())
            {
                if (ass.FullName == jIn.assembly)
                {
                    isLoaded = true;
                }
            }

            if (!isLoaded)
            {

                try
                {
                    Assembly.Load(jIn.assembly);
                    isLoaded = true;
                }
                catch (Exception ex)
                {

                }
                finally
                {
                    if (!isLoaded)
                    {
                        string assfile = jIn.file.Replace("/", @"\");
                        Assembly.LoadFrom(assfile);
                        isLoaded = true;
                    }
                }
            }

            if (!isLoaded)
            {
                //  throw ("Fucking bummer");
            }
            ii++;

            T = GetTypeFromTypeName(jIn.name, jIn.assembly);

            if (T.GetConstructor(Type.EmptyTypes) == null && T.IsAbstract && T.IsSealed)
            {
                jIn.IsStatic = true;
            }

            if (!jIn.IsStatic)
            {

                ii++;

                int pLen = jIn.parms.Length;

                if (pLen == 0)
                {
                    o = Activator.CreateInstance(T);
                }
                else
                {

                    foreach (ConstructorInfo ci in T.GetConstructors())
                    {

                        ParameterInfo[] pis = ci.GetParameters();
                        dynamic[] parms = new dynamic[pLen];
                        if (pLen == pis.Length)
                        {
                            for (int i = 0; i < pLen; i++)
                            {
                                parms[i] = ConvertInParm(pis[i].ParameterType, jIn.parms[i]);

                            }
                            o = Activator.CreateInstance(T, parms);

                        }
                    }

                }


                if (o != null)
                {
                    NextCsID++;
                    Cache.Add(NextCsID, new classy(o));
                    jOut.retval = NextCsID;
                }
            }

            ii++;

        }
        catch (Exception ex)
        {
            jOut.errmsg = ii + " " + ex.Message;
        }

    }

    public static Type GetTypeFromTypeName(string typeName, string assemblyName)
    {

        Type retT = null;

        foreach (Assembly ai in AppDomain.CurrentDomain.GetAssemblies())
        {
            if (ai.FullName == assemblyName)
            {
                foreach (Type T in ai.GetTypes())
                {
                    if (T.FullName == typeName)
                    {
                        retT = T;
                    }
                }

                if (retT != null) break;
            }

        }

        return retT;
    }

    public static void DoMethod(dynamic o, Type T, EdgeIn jIn, EdgeOut jOut)
    {

        int ix = 0;

        switch (jIn.name)
        {
            case "edKeyAt":

                foreach (dynamic el in o.Keys)
                {
                    if (ix == jIn.index)
                    {
                        ConvertOutParm(el, jIn.csid,  jIn.ret.type, ref jOut.retval);
                        return;
                    }
                    ix++;
                }

                break;
            case "edValueAt":

                PropertyInfo piI = T.GetProperty("Item", BindingFlags.Instance | BindingFlags.Public);

                foreach (dynamic el in o.Keys)
                {
                    if (ix == jIn.index)
                    {

                        dynamic[] newArray = new dynamic[1];
                        newArray[0] = el;
                        jIn.index = newArray;

                        if (jIn.parms.Length == 1)
                        {
     
                            dynamic pvalI = ConvertInParm(piI.PropertyType, jIn.parms[0]);
                            Console.WriteLine("Aafter ValueAt Set");
                            piI.SetValue(o, pvalI, jIn.index);
                            Console.WriteLine("Bafter ValueAt Set");
                        }
                        else
                        {
                            Console.WriteLine("C after ValueAt Set");

                            dynamic val = piI.GetValue(o, jIn.index);
                            Console.WriteLine("Dafter ValueAt Set");
                            ConvertOutParm(val, jIn.csid, jIn.ret.type, ref jOut.retval);
                            Console.WriteLine("Eafter ValueAt Set");
                        }

                        return;
                    }
                    ix++;
                }
               
                break;
            
            default:
                break;
        }

        var plist = T.GetProperties(BindingFlags.Instance | BindingFlags.Public).Where(x => x.Name == jIn.name).ToList();

        PropertyInfo pi = null;
        dynamic pval = null;

        if (plist.Count > 0)
        {
 
            if (jIn.act == 2)
            {
                pi = plist[0];
            }
            else
            { 
                foreach(PropertyInfo minfo in plist)
                {
                    pval = ConvertInParm(minfo.PropertyType, jIn.parms[0]);

                    if (pval == null) continue;
 
                    pi = minfo;
                    break;
                }

                if (pi == null)
                {
                    Console.WriteLine("SIGH");
                }
            }
        }

        if (pi != null)
        {
            if (jIn.index != null)
            {
                dynamic[] newArray = new dynamic[1];
                newArray[0] = jIn.index;
                jIn.index = newArray;
            }

            if (jIn.act == 2)
            {
                dynamic result = pi.GetValue(o, jIn.index);
 //               Console.WriteLine("prop return " + result.ToString());
                ConvertOutParm(result, jIn.csid,  jIn.ret.type, ref jOut.retval);
 //               Console.WriteLine("prop return after " + jOut.retval);
            }
            else
            {
                pi.SetValue(o, pval, jIn.index);
 //               dynamic result = pi.GetValue(o, jIn.index);
 //               Console.WriteLine("prop return " + result.ToString());

            }

            return;
        }

        FieldInfo fi = T.GetField(jIn.name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);

        if (fi != null)
        {


            if (jIn.act == 2)
            {
                dynamic result = fi.GetValue(o);
                ConvertOutParm(result, jIn.csid,  jIn.ret.type, ref jOut.retval);
            }
            else
            {
                object parm = ConvertInParm(fi.FieldType, jIn.ret);

                fi.SetValue(o, parm);
            }

            return;

        }

        foreach (MethodInfo mi in T.GetMethods())
        {
            if (mi.Name == jIn.name)
            {

                ParameterInfo[] pis = mi.GetParameters();
                int pLen = pis.Length;
                if (pLen == jIn.parms.Length)
                {
                    object[] parms = null;

                    bool isMatch = true;

                    if (pLen > 0)
                    {
                        parms = new object[pLen];

                        for (int i = 0; i < pLen; i++)
                        {
                            dynamic newParm = ConvertInParm(pis[i].ParameterType, jIn.parms[i]);
                            if (newParm == null)
                            {
                                isMatch = false;
                                break;
                            }

                            parms[i] = newParm;
                        }
                    }

                    if (isMatch)
                    {

                        dynamic retval = mi.Invoke(o, parms);

                        if (pLen > 0)
                        {
                            jOut.parms = new dynamic[pLen];

                            for (int i = 0; i < pLen; i++)
                            {
                                if (pis[i].IsOut || pis[i].ParameterType.IsByRef)
                                    ConvertOutParm(parms[i], jIn.csid,  jIn.parms[i].type, ref jOut.parms[i]);
                            }
                        }

                        ConvertOutParm(retval, jIn.csid,  jIn.ret.type, ref jOut.retval);
                        return;
                    }
                }
            }
        }
    }

    public static dynamic ConvertInParm(Type ParameterType, parm jParm)
    {

        dynamic val = jParm.value;
        int T = jParm.type;

        dynamic retval = null;

        int csid = 0;

        if (ParameterType.IsEnum)
        {
            retval = Enum.ToObject(ParameterType,val);
 //           Console.WriteLine(" enum in " + val + " " + retval.ToString());
            return retval;
        }

        if (T < 0)
        {
            csid = Convert.ToInt32(val);
            retval = Cache[csid].o;
            if (retval.GetType() != ParameterType) retval = null;
        }
        else
        {
            switch (T)
            {
                case 0:
                    break;
                case 1:
                    retval = Convert.ToString(val);
                    break;
                case 2:
                    retval = Convert.ToBoolean(val);
                    break;
                case 3:
                    retval = Convert.ToDateTime(val);
                    break;
                case 4:
                    retval = Convert.ToInt32(val);
                    break;
                case 5:
                    retval = Convert.ToDouble(val);
                    break;
                case 6:
                    retval = Convert.ToUInt32(val);
                    break;
                case 7:
                    retval = Convert.ToInt64(val);
                    break;
                case 8:
                    retval = Convert.ToUInt64(val);
                    break;
                case 9:
                    retval = Convert.ToSingle(val);
                    break;
                case 10:
                    retval = Convert.ToInt16(val);
                    break;
                case 11:
                    retval = Convert.ToUInt16(val);
                    break;
                case 12:
                    retval = Convert.ToDecimal(val);
                    break;
                case 13:
                    retval = Convert.ToByte(val);
                    break;
                case 14:
                    retval = Convert.ToSByte(val);
                    break;
                case 15:
                    retval = Convert.ToChar(val);
                    break;
                case 16:
                    retval = val;
                    break;

            }

        }
        
        return retval;

    }
        
    public static void ConvertOutParm(dynamic o, int parentCsid, int iType, ref dynamic dOut)
    {
        if (o == null)
        {
            dOut = null;
            return;
        }
        if (o.GetType().IsEnum)
        {
            dOut = Convert.ChangeType(o,typeof(int));

 //           Console.WriteLine("parm out " + o.ToString() + " " +dOut) ;
            return;

        }
        if (iType < 0) //class
        {
            dOut = GetCsID(parentCsid, o);

        }
        else
        {
            dOut = o;
        }
    
    }

    static Type GetGenericType(string Info, ref int typeID)
    {
        string[] typeInfo = Info.Split("|"[0]);

        Type retval = null;
        string linType = typeInfo[0].ToLower();
        switch (linType)
        {
            case "string":
                retval = typeof(string);
                typeID = 1;
                break;
            case "bool":
                retval = typeof(bool);
                typeID = 2;
                break;
            case "datetime":
                retval = typeof(DateTime);
                typeID = 3;
                break;
            case "int":
                retval = typeof(int);
                typeID = 4;
                break;
            case "double":
                retval = typeof(double);
                typeID = 5;
                break;
            case "uint":
                retval = typeof(uint);
                typeID = 6;
                break;
            case "long":
                retval = typeof(long);
                typeID = 7;
                break;
            case "ulong":
                retval = typeof(ulong);
                typeID = 8;
                break;
            case "float":
                //single
                retval = typeof(float);
                typeID = 9;
                break;
            case "short":
                retval = typeof(short);
                typeID = 10;
                break;
            case "ushort":
                retval = typeof(ushort);
                typeID = 11;
                break;
            case "decimal":
                retval = typeof(decimal);
                typeID = 12;
                break;
            case "byte":
                retval = typeof(decimal);
                typeID = 13;
                break;
            case "sbyte":
                retval = typeof(decimal);
                typeID = 14;
                break;
            case "char":
                retval = typeof(char);
                typeID = 15;
                break;
            case "dynamic":
            case "object":
                retval = typeof(object);
                typeID = 16;
                break;
            default:
                retval = GetTypeFromTypeName(typeInfo[0], typeInfo[1]);
                if (retval == null) Console.WriteLine("failed to get object type " + Info);
                typeID = -1;
                break;

        }

        return retval;
    }

    public static int GetCsID(int parentCsid, dynamic o)
    {
        int csid = 0;
        int row = 0;
        bool hit = false;

        var classyDad = Cache[parentCsid];

        foreach (int icsid in classyDad.csids)
        {
            classy co = Cache[icsid];
            if (Object.ReferenceEquals(co.o, o))
            {
                return icsid;
            }
        }

        foreach (classy co in Cache.Values)
        {
            if (Object.ReferenceEquals(co.o, o))
            {
                return  Cache.Keys.ElementAt(row);
            }

            row++;
        }

        csid = ++NextCsID;
        Cache.Add(csid, new classy(o));
   
        if (!classyDad.csids.Contains(csid))
        {
            classyDad.csids.Add(csid);
        }

        return csid;

    }

    public static void release(int csid)
    {
        /*
            assumption the only reference is the Cache list, 
            lose membership and the garbage man gets you
        */

        var csids = new List<int>();

        csidTree(csid, csids);

        foreach (int kcsid in csids)
        {
            try
            {
                Cache.Remove(kcsid);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            };
        }
    }

    public static List<int> csidTree(int csid, List<int> tree)
    {
        if (Cache.ContainsKey(csid))
        {

            foreach (int kcsid in Cache[csid].csids)
            {
                csidTree(kcsid, tree);
            }
        }

        return tree;

    }

}

