import dns from 'dns';

dns.resolveSrv(
  '_mongodb._tcp.taller-mecanico.epwurln.mongodb.net',
  (err, addresses) => {
    console.log('ERROR:', err);
    console.log('ADDRESSES:', addresses);
  }
);