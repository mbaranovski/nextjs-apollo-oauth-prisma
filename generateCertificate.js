const forge = require("node-forge");
const fs = require("fs");
const path = require("path");
function generateCertificate() {
  const privateKeyPath = path.join("./", "private.pem");
  const certPath = path.join("./", "primary.crt");
  const cachedKey =
    fs.existsSync(privateKeyPath) && fs.readFileSync(privateKeyPath);
  const cachedCert = fs.existsSync(certPath) && fs.readFileSync(certPath);
  if (cachedKey && cachedCert) {
    return {
      key: cachedKey,
      cert: cachedCert
    };
  }
  console.log("Generating SSL Certificate...");
  const pki = forge.pki;
  const keys = pki.rsa.generateKeyPair(2048);
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  const attrs = [
    {
      name: "commonName",
      value: "shop.backend"
    },
    {
      name: "countryName",
      value: "UAE"
    },
    {
      shortName: "ST",
      value: "AbuDhabi"
    },
    {
      name: "localityName",
      value: "Bombel"
    },
    {
      name: "organizationName",
      value: "BombelCompany"
    },
    {
      shortName: "OU",
      value: "Test"
    }
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: "basicConstraints",
      cA: true
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    },
    {
      name: "nsCertType",
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    },
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 6, // URI
          value: "http://example.org/webid#me"
        },
        {
          type: 7, // IP
          ip: "127.0.0.1"
        }
      ]
    },
    {
      name: "subjectKeyIdentifier"
    }
  ]);
  cert.sign(keys.privateKey, forge.md.sha256.create());
  const privPem = pki.privateKeyToPem(keys.privateKey);
  const certPem = pki.certificateToPem(cert);
  fs.writeFileSync(privateKeyPath, privPem);
  fs.writeFileSync(certPath, certPem);
  return {
    key: privPem,
    cert: certPem
  };
}
module.exports = generateCertificate;
