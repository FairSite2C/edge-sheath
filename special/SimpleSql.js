
class SimpleSql {

    constructor(cs) {

        this.cs = cs;
        
        this.params;

        this.ReturnValues;
        
        this.DataSet;
        this.DataTable;
        this.Rows;
        this.Row;
        this.RowsAffected = 0;

        this.ErrMessage = '';

        this.myConnection;
        this.ConnectionString = '';
        this.IsRunning = false;
        this.NowRow = 0;

    }

    GetRowValue(Column) {
        try {
            var col = this.Row.Item(Column);
            return col;
        } catch (err) {
            ErrMessage = ex.Message
            return null;
        }
    }

    Init(ConnectionString) {

        let strConn = ConnectionString;

        if (this.myConnection != null) {
            if (this.myConnection.State == this.cs.e("*System.Data.ConnectionState").Open) this.myConnection.Close();
            this.myConnection.release();
        }

        this.myConnection = this.cs.new('*System.Data.SqlClient.SqlConnection', [strConn]);
        this.myConnection.Open();
        
        if (this.params != null) this.parms.release();
        this.params = this.cs.new('Dictionary', ['string', '*System.Data.SqlClient.SqlParameter']);
        
        if (this.ReturnValues != null) this.ReturnValues.release();
        this.ReturnValues = this.cs.new('Dictionary', ['string', 'dynamic']);
        
        this.RowsAffected = 0;
        this.IsRunning = false;
        this.NowRow = 0;
        this.ErrMessage = "";

    }

    AddParameter(ParamName, ParamValue, ParmType, Direction = this.cs.e('*System.Data.ParameterDirection').Input) {

        let newParam = this.cs.new('*System.Data.SqlClient.SqlParameter');

        newParam.ParameterName = ParamName;
        newParam.DbType = ParmType;
        newParam.Value = ParamValue;
    
        let pd = this.cs.e('*System.Data.ParameterDirection');
        if (Direction == pd.ReturnValue ||
            Direction == pd.Output) {
            newParam.Direction = Direction;
        }

    
        if (!this.params.ContainsKey(ParamName)) {
            this.params.Add(ParamName,newParam);
        }

        //newParam.release();
    }
    
    Run(Sql) {

        let retVal = false;

        try {

            if (!this.IsRunning) {

                let Command = "";

                let cmdType = 0; // '1 select,2 non exec,3 stored procedure, 

                this.myCommand = this.cs.new('*System.Data.SqlClient.SqlCommand', [Sql, this.myConnection]);
                
                let CommandType = this.cs.e('*System.Data.CommandType');

                let firstSpace = Sql.indexOf(' ');

                this.myCommand = this.cs.new('*System.Data.SqlClient.SqlCommand', [Sql, this.myConnection]);
 
                if (firstSpace == -1) {
                    cmdType = 3;
                    this.myCommand.CommandType = CommandType.StoredProcedure;
                    let tParms = this.myCommand.Parameters;
                    for (let i = 0; i < this.params.Count; i++) {
                        tParms.Add(this.params.ValueAt(0));
                    }

                }else{

                    Command = Sql.substring(0, firstSpace).toLowerCase();

                    cmdType = (Command == 'select' ? 1 : 2);

                   this.myCommand.CommandType = CommandType.Text;
 
                }

                if (cmdType == 2) {

                    RowsAffected = this.myCommand.ExecuteNonQuery()
                    retVal = true;

                } else {

                    let da = this.cs.new('*System.Data.SqlClient.SqlDataAdapter');
                    da.SelectCommand = this.myCommand;
                    
                    this.DataSet = this.cs.new('*System.Data.DataSet');
                    da.Fill(this.DataSet);
                    
                    let Tables = this.DataSet.Tables;
                    if (Tables.Count > 0) {
                        
                        this.DataTable = Tables.Item(0);
                        this.Rows = this.DataTable.Rows;
                        let cnt = this.Rows.Count;
                        if (cnt > 0) {
                            if(this.Row != null) this.Row.release();
                            this.Row = this.Rows.Item(0);
                            this.NowRow = 1;
            				this.IsRunning = true;
                            retVal = true;
                        }
                    }
    
                    this.myCommand.release();
                    da.release();
                    this.DataSet.release();
                    this.DataTable.release();
           
                    if (cmdType == 3) {
                        if (this.myCommand.Parameters.Count > 0) {
                            for (let i = 0; i < this.myCommand.Parameters.Count; i++) {
                                let SQLParam = this.cs.new('*System.Data.SqlClient.SqlParameter');
                                SQLParam = this.myCommand.Parameters.Item(i);
                                if (SQLParam.Direction != this.cs.e('*System.Data.ParameterDirection').Input) {
                                    this.ReturnValues.Add(SQLParam.ParameterName, SQLParam.Value)
                                }
                            }
                        }
                    }
                }

				
				return retVal;

			} else {

				retVal = (this.NowRow  < this.Rows.Count);
                if (retVal) {
					this.Row = this.Rows.Item(this.NowRow);
					this.NowRow++;
               }else{
                   this.NowRow = 0;
                   this.IsRunning = false;
                   this.Rows.release();
                   this.Row.release();
               }
                
			   return retVal;
			}

		}
		catch (ex) {
			this.ErrMessage = ex;
			return false;
		}
	}	
}

module.exports =  SimpleSql;

