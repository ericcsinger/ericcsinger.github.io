(() => {
  // ns-hugo-params:C:\Users\es10882\Downloads\SourceCode\website\themes\hugo-theme-bootstrap\assets\js\local-storage\index.ts
  var local_storage_default = { baseURL: "https://ericcsinger.com/" };

  // ns-hugo-imp:C:\Users\es10882\Downloads\SourceCode\website\themes\hugo-theme-bootstrap\assets\js\local-storage\index.ts
  var PathLocalStorage = class {
    constructor(baseURL) {
      this.baseURL = baseURL;
      if (baseURL.substring(0, 2) === "//") {
        baseURL = "http:" + baseURL;
      }
      let url;
      try {
        url = new URL(baseURL);
      } catch (e) {
        url = new URL(baseURL, location.protocol + "//" + location.host);
      }
      const pathname = url.pathname.replace(/^(\/+)/, "").replace(/(\/+)$/, "");
      if (pathname !== "") {
        this.prefix += pathname.replace("/", "-") + ":";
      }
    }
    prefix = "hbs:";
    getItem(key) {
      return localStorage.getItem(this.prefix + key);
    }
    setItem(key, value) {
      localStorage.setItem(this.prefix + key, value);
    }
    removeItem(key) {
      localStorage.removeItem(this.prefix + key);
    }
  };
  var local_storage_default2 = new PathLocalStorage(local_storage_default.baseURL);

  // <stdin>
  (() => {
    if (local_storage_default2.getItem("sidebar-toggle") !== null && document.querySelector("main")?.getAttribute("data-kind") === "page") {
      document.querySelector("main")?.classList.add("sidebar-none");
    }
  })();
})();
