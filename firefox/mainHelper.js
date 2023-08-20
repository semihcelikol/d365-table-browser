
window.onload = function() {
    const btnGithub = document.getElementById("btnGithub");
    const btnBuymeacoffee = document.getElementById("btnBuymeacoffee");
    const btnShow = document.getElementById("btnShow");

    if(btnGithub != null) {
        btnGithub.onclick = function() {
            openLink("https://github.com/semihcelikol/d365-table-browser");
        };
    }

    if(btnBuymeacoffee != null) {
        btnBuymeacoffee.onclick = function() {
            openLink("https://www.buymeacoffee.com/semihc");
        };
    }

    if(btnShow != null) {
        btnShow.onclick = function() {
            openTableBrowserLink();
        };
    }
}

function openTableBrowserLink() {
    var baseUrl = document.getElementById("baseUrl").value;
    var tableName = document.getElementById("tableName").value;
    var companyCode = document.getElementById("companyCode").value;

    var ret = baseUrl.search(".com/");

    if((baseUrl != "")
        && tableName != ""
        && companyCode != "")
        {
            if(ret > 0)
            {
                openLink(baseUrl + "?mi=SysTableBrowser&TableName="+tableName+"&cmp="+companyCode);
            }
            else
            {
                baseUrl += "/";
                openLink(baseUrl + "?mi=SysTableBrowser&TableName="+tableName+"&cmp="+companyCode);
            }
        }
        else
        {
            alert("Tüm alanları doldurmalısınız.");
        }
};

function openLink(url){
    window.open(url, "_blank");
}