# mobber

A distributed mobbing timer

Check it out now at https://mobber.dev!

Please file any issues or requests you have [here](https://github.com/camleng/mobber/issues).

## Certification Renewal
If the SSL certificate has expired, follow these steps to renew the certificate

- Open `server.js`
   - Import from `http` instead of `https`
   - Comment out production `if` block
   - Create server without SSL files
- Run `certbot certonly --manual`
- Add challenge file in `.well-known/acme-challenge`
- Run `node server.js`
- Finish certbot prompt
- `sudo chown` to own the `fullchain.pem` and `privkey.pem` files that were generated
- Put back everything when finished!

