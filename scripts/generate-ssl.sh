#!/usr/bin/env bash
set -euo pipefail

SSL_DIR="ssl"
KEY="$SSL_DIR/key.pem"
CERT="$SSL_DIR/cert.pem"
OPENSSL_CNF="$SSL_DIR/openssl.cnf"

if [[ -f "$CERT" && -f "$KEY" ]]; then
  echo "Certificado existente en $SSL_DIR; no se genera uno nuevo."
  exit 0
fi

mkdir -p "$SSL_DIR"

IP=""
if command -v ip >/dev/null 2>&1; then
  IP="$(ip route get 1.1.1.1 2>/dev/null | awk '/src/ {print $7; exit}')"
fi
if [[ -z "$IP" ]] && command -v hostname >/dev/null 2>&1; then
  IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
fi
if [[ -z "$IP" ]]; then
  IP="127.0.0.1"
fi

cat > "$OPENSSL_CNF" <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Org
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = $IP
EOF

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$KEY" -out "$CERT" \
  -config "$OPENSSL_CNF" -extensions v3_req

echo "Generado certificado autofirmado:"
echo "  Cert: $CERT"
echo "  Key:  $KEY"
echo "SANs: localhost, 127.0.0.1, $IP"
