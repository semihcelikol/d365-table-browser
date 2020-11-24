document.addEventListener("click", (e) => {
    
    var baseUrl = null;
    var tableName = null;
    var companyCode = null;

    if(e.target.name == "btnShow")
    {
        baseUrl = document.getElementById("baseUrl").value;
        tableName = document.getElementById("tableName").value;
        companyCode = document.getElementById("companyCode").value;

        window.open(baseUrl + "?mi=SysTableBrowser&TableName="+tableName+"&cmp="+companyCode, "_blank");
    }
})