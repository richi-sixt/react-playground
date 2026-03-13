// Wrapper to bridge the Next.js standalone server with cPanel's Passenger
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
  const http = require("http");
  const origListen = http.Server.prototype.listen;
  http.Server.prototype.listen = function () {
    return origListen.call(this, "passenger");
  };
}

process.env.HOSTNAME = "0.0.0.0";
require("./.next/standalone/server.js");
