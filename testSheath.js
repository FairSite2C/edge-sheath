var cs = require('edge-sheath');

var dic = cs.new('Dictionary',['string','string']);
dic.Add('yomama','bsonice');
dic.Add('yopapa','nasty');
if (dic.ContainsKey('yomama')){
var ret = dic.Item('yomama');
}
console.log(ret);
cs.prefix ="System.Data.SqlClient";
cs.new('SqlCommand');

var sql = cs.new('SimpleSql');

var cstring = 'Data Source=localhost,1433;Network Library=DBMSSOCN;Initial Catalog=sheath;User ID=guest;Password=guest;';
sql.Init(cstring);

console.log('=============Non Select Command ');

sql.Run("insert into Animals (Animal,Feet,Fur) values ('Chimpanzee',2,1)");

console.log('=============Exec Stored Procedure IS FUZZY ');

sql.AddParameter('IsFurry',1,cs.e('*System.Data.SqlDbType').Bit);
while(sql.Run('IsFurryAnimal')){
    console.log(sql.GetRowValue(0));
}

console.log('=============Non Select Command ');

sql.Run("delete from  Animals where Animal = 'Chimpanzee'");


console.log('=============Select Command ');

while(sql.Run('select * from animals order by animal')){
    console.log(sql.GetRowValue(0));
}

