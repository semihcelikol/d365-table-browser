let savedEnvs = [];
let historyTables = [];
let favoriteTables = [];

window.onload = function() {
    const btnGithub = document.getElementById("btnGithub");
    const btnBuymeacoffee = document.getElementById("btnBuymeacoffee");
    const btnShow = document.getElementById("btnShow");
    const envSelect = document.getElementById("envSelect");
    const btnToggleAddEnv = document.getElementById("btnToggleAddEnv");
    const btnSaveEnv = document.getElementById("btnSaveEnv");
    const btnDeleteEnv = document.getElementById("btnDeleteEnv");
    const btnStar = document.getElementById("btnStar");
    const baseUrlInput = document.getElementById("baseUrl");

    // Firefox Native Storage API (Promise tabanlı)
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local.get(['envs', 'history', 'favorites', 'lastCompany'])
            .then(result => {
                if(result.envs) savedEnvs = result.envs;
                if(result.history) historyTables = result.history;
                if(result.favorites) favoriteTables = result.favorites;
                if(result.lastCompany) document.getElementById("companyCode").value = result.lastCompany;
                
                renderEnvs();
                renderChips();
            })
            .catch(err => console.error("Storage load error:", err));
    }

    envSelect.addEventListener("change", function() {
        if(this.value) {
            baseUrlInput.value = this.value;
            const isSaved = savedEnvs.some(e => e.url === this.value);
            btnDeleteEnv.style.display = isSaved ? "block" : "none";
        } else {
            btnDeleteEnv.style.display = "none";
        }
    });

    btnToggleAddEnv.addEventListener("click", function() {
        const div = document.getElementById("addEnvDiv");
        div.style.display = div.style.display === "none" ? "flex" : "none";
    });

    btnSaveEnv.addEventListener("click", function() {
        const name = document.getElementById("newEnvName").value.trim();
        const url = document.getElementById("newEnvUrl").value.trim();
        
        if(!name || !url) {
            alert("Please provide both environment name and URL.");
            return;
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            alert("Error: URL must start with 'http://' or 'https://'.");
            return;
        }
        if (!url.includes(".com")) {
            alert("Error: URL must contain a valid domain extension (e.g., .com).");
            return;
        }
        
        savedEnvs.push({ name: name, url: url });
        saveToStorage('envs', savedEnvs);
        renderEnvs();
        envSelect.value = url;
        baseUrlInput.value = url;
        btnDeleteEnv.style.display = "block";
        
        document.getElementById("newEnvName").value = "";
        document.getElementById("newEnvUrl").value = "";
        document.getElementById("addEnvDiv").style.display = "none";
    });

    btnDeleteEnv.addEventListener("click", function() {
        const selectedUrl = envSelect.value;
        if(selectedUrl) {
            savedEnvs = savedEnvs.filter(e => e.url !== selectedUrl);
            saveToStorage('envs', savedEnvs);
            renderEnvs();
            envSelect.value = "";
            baseUrlInput.value = "";
            this.style.display = "none";
        }
    });

    btnStar.addEventListener("click", function() {
        const tableName = document.getElementById("tableName").value.trim();
        if(tableName && !favoriteTables.includes(tableName)) {
            favoriteTables.push(tableName);
            saveToStorage('favorites', favoriteTables);
            renderChips();
        }
    });

    if(btnGithub) btnGithub.onclick = () => openLink("https://github.com/semihcelikol/d365-table-browser");
    if(btnBuymeacoffee) btnBuymeacoffee.onclick = () => openLink("https://www.buymeacoffee.com/semihc");
    if(btnShow) btnShow.onclick = () => openTableBrowserLink();
}

function renderEnvs() {
    const envSelect = document.getElementById("envSelect");
    const currentVal = envSelect.value;
    
    envSelect.innerHTML = '<option value="">-- Select or Enter URL --</option>';
    
    savedEnvs.forEach(env => {
        let opt = document.createElement("option");
        opt.value = env.url;
        opt.textContent = env.name + " - " + env.url;
        envSelect.appendChild(opt);
    });

    if (savedEnvs.some(e => e.url === currentVal)) {
        envSelect.value = currentVal;
    }
}

function renderChips() {
    const favDiv = document.getElementById("favoritesContainer");
    const histDiv = document.getElementById("historyContainer");
    
    favDiv.innerHTML = "";
    histDiv.innerHTML = "";

    if (favoriteTables.length > 0) {
        let favTitle = document.createElement("div");
        favTitle.innerHTML = "<small class='text-muted' style='font-size:11px;'>Favorites:</small><br>";
        favDiv.appendChild(favTitle);

        favoriteTables.forEach(table => {
            let span = document.createElement("span");
            span.className = "badge bg-warning text-dark chip";
            
            let textSpan = document.createElement("span");
            textSpan.innerHTML = "⭐ " + table;
            textSpan.onclick = () => document.getElementById("tableName").value = table;
            
            let closeSpan = document.createElement("span");
            closeSpan.innerHTML = "&times;";
            closeSpan.className = "chip-close";
            closeSpan.onclick = (e) => {
                e.stopPropagation(); 
                favoriteTables = favoriteTables.filter(t => t !== table);
                saveToStorage('favorites', favoriteTables);
                renderChips();
            };

            span.appendChild(textSpan);
            span.appendChild(closeSpan);
            favDiv.appendChild(span);
        });
    }

    if (historyTables.length > 0) {
        let histTitle = document.createElement("div");
        histTitle.innerHTML = "<small class='text-muted mt-1 d-block' style='font-size:11px;'>Recent Searches:</small>";
        histDiv.appendChild(histTitle);

        historyTables.forEach(table => {
            let span = document.createElement("span");
            span.className = "badge bg-secondary chip";
            
            let textSpan = document.createElement("span");
            textSpan.innerHTML = table;
            textSpan.onclick = () => document.getElementById("tableName").value = table;

            let closeSpan = document.createElement("span");
            closeSpan.innerHTML = "&times;";
            closeSpan.className = "chip-close";
            closeSpan.onclick = (e) => {
                e.stopPropagation(); 
                historyTables = historyTables.filter(t => t !== table);
                saveToStorage('history', historyTables);
                renderChips();
            };

            span.appendChild(textSpan);
            span.appendChild(closeSpan);
            histDiv.appendChild(span);
        });
    }
}

function openTableBrowserLink() {
    let baseUrl = document.getElementById("baseUrl").value.trim();
    const tableName = document.getElementById("tableName").value.trim();
    const companyCode = document.getElementById("companyCode").value.trim();

    if (baseUrl !== "" && tableName !== "" && companyCode !== "") {
        
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
            alert("Error: Base URL must start with 'http://' or 'https://'.");
            return;
        }
        if (!baseUrl.includes(".com")) {
            alert("Error: Base URL must contain a valid domain extension (e.g., .com).");
            return;
        }

        saveToStorage('lastCompany', companyCode);

        if (!historyTables.includes(tableName)) {
            historyTables.unshift(tableName);
            if(historyTables.length > 5) historyTables.pop();
            saveToStorage('history', historyTables);
            renderChips();
        }

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        
        openLink(baseUrl + "?mi=SysTableBrowser&TableName=" + tableName + "&cmp=" + companyCode);
    } else {
        alert("Please fill in all required fields.");
    }
}

// Firefox Native Kaydetme Fonksiyonu
function saveToStorage(key, data) {
    let obj = {};
    obj[key] = data;

    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local.set(obj).catch(err => {
            console.error("Storage Error:", err);
        });
    }
}

function openLink(url){
    window.open(url, "_blank");
}